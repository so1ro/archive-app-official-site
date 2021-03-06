import { stripe } from '@/utils/stripe'
import axios from 'axios'
import _ from 'lodash'

const getAuth0URL = (id) => {
    return `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`
}

////////////////////////////////////////////////
// Get Auth0 Access Token
const auth0AccessToken = async () => {
    // Options of Fetch Access_token
    const options = {
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            client_id: `${process.env.AUTH0_MTOM_CLIENTID}`,
            client_secret: `${process.env.AUTH0_MTOM_CLIENT_SECRET}`
        }
    }
    const { access_token } = await axios(options)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })
    return access_token

}

////////////////////////////////////////////////
// Patch user's App_metadata to Auth0
const patchUserMetadataToAuth0 = async (user_id, token, metadata) => {
    const URL = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`
    const option = {
        url: URL,
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${token}`
        },
        data: {
            user_metadata: { ...metadata }
        }
    }

    const data = await axios(option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}

////////////////////////////////////////////////
// Exported Function
////////////////////////////////////////////////

//// Get User metadata from Auth0
const getUserMetadata = async (user_id, token) => {
    const URL = getAuth0URL(user_id)
    const auth0Token = !!token ? token : await auth0AccessToken()

    const option = { headers: { authorization: `Bearer ${auth0Token}` } }
    const data = await axios(URL, option)
        .then(res => res.data)
        .catch(err => { throw new Error(err) })

    return data
}


//// Upsert User Metadata
const upsertUserMetadata = async (auth0_UUID, meta) => {

    try {
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { User_Detail: currentUserDetail } } = await getUserMetadata(auth0_UUID, auth0Token)
        const metadata = { User_Detail: { ...currentUserDetail, ...meta } }
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`api/upsert-user-metadata ??????????????????Auth0???metadata?????????????????????auth0_UUID : ${auth0_UUID}, metadata : ${metadata}`, e)
        loggerError_Serverside(req, res, e, `api/upsert-user-metadata ??????????????????Auth0???metadata?????????????????????auth0_UUID : ${auth0_UUID}, metadata : ${metadata}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}


//////////////////////
//// Send Subscription record to Auth0
const upsertSubscriptionRecord = async (event) => {

    const { id: subscription_Id, customer: customer_Id } = event

    try {
        const { metadata: { auth0_UUID } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { User_Detail: currentUserDetail } } = await getUserMetadata(auth0_UUID, auth0Token)
        const meta = { "isStarted": true }
        const metadata = {
            Subscription_Detail: { subscription_Id },
            User_Detail: { ...currentUserDetail, ...meta }
        }
        // canceled_at : If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with cancel_at_period_end, canceled_at will reflect the time of the most recent update request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertSubscriptionRecord(api/stripe/webhook) ??????????????????Auth0???Subscription???????????????????????????subscriptionID : ${subscription_Id}, customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertSubscriptionRecord(api/stripe/webhook) ??????????????????Auth0???Subscription???????????????????????????subscriptionID : ${subscription_Id}, customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send Charge (Payment Amount) record to Auth0
const upsertChargeRecord = async (event) => {

    const status = event.object // 'invoice' or 'refund'
    const customer_Id = event.customer

    let amount
    if (status === 'invoice') amount = event.amount_paid
    if (status === 'charge') amount = event.amount_refunded * -1

    try {
        const { metadata: { auth0_UUID, criteria_OnePay_price } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { User_Detail: { past_charged_fee } } } = await getUserMetadata(auth0_UUID, auth0Token)

        const currentChargedFee = (past_charged_fee + amount) || 0

        // if Refund for One Pay, remove One Pay record from Auth0
        let metadata = {}
        amount + parseFloat(criteria_OnePay_price) === 0 ?
            metadata = { User_Detail: { past_charged_fee: currentChargedFee }, One_Pay_Detail: null } :
            metadata = { User_Detail: { past_charged_fee: currentChargedFee } }

        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertChargeRecord (api/stripe/webhook) ??????????????????Auth0???"???????????????"???????????????????????????amount : ${amount}, customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertChargeRecord (api/stripe/webhook) ??????????????????Auth0???"???????????????"???????????????????????????amount : ${amount}, customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send One-pay record to Auth0
const upsertOnePayRecord = async (event) => {

    const { amount, customer: customer_Id, created, } = event

    try {

        const { metadata: { auth0_UUID, criteria_OnePay_price } } = await stripe.customers.retrieve(customer_Id)
        const auth0Token = await auth0AccessToken()

        // if it's subscription charge.succeeded, it returns here
        if (amount !== parseFloat(criteria_OnePay_price)) return

        const { user_metadata: { User_Detail: { past_charged_fee } } } = await getUserMetadata(auth0_UUID, auth0Token)
        const currentChargedFee = (past_charged_fee + amount) || 0
        const metadata = {
            One_Pay_Detail: {
                title: '???????????????????????????',
                created,
                criteria_OnePay_price,
            },
            User_Detail: { past_charged_fee: currentChargedFee }
        }
        await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)

    } catch (e) {
        //// Logging ////
        console.error(`upsertOnePayRecord (api/stripe/webhook) ??????????????????Auth0???One_Pay_Detail???????????????????????????customerID : ${customer_Id}`, e)
        loggerError_Serverside(req, res, e, `upsertOnePayRecord (api/stripe/webhook) ??????????????????Auth0???One_Pay_Detail???????????????????????????customerID : ${customer_Id}`)
        //// end of Logging ////      
        throw new Error(e)
    }
}

//// Send Favorite Video Id record to Auth0
const upsertFavoriteVideo = async (auth0_UUID, favoriteVideo) => {

    try {
        const auth0Token = await auth0AccessToken()
        const { user_metadata: { User_Detail: { past_charged_fee } } } = await getUserMetadata(auth0_UUID, auth0Token)
        const metadata = { User_Detail: { past_charged_fee, favorite_video: favoriteVideo } }
        const data = await patchUserMetadataToAuth0(auth0_UUID, auth0Token, metadata)
        return data

    } catch (e) {
        console.error('Error in upsertFavoriteVideo:', e)
        throw new Error(err)
    }
}

////////////////////////////////////////////////


export {
    getUserMetadata,
    upsertUserMetadata,
    /// delete in future
    upsertSubscriptionRecord,
    upsertChargeRecord,
    upsertOnePayRecord,
    upsertFavoriteVideo,
    ///
}