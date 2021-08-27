////// Graphql Chrome Extension //////
// URL: https://graphql.contentful.com/content/v1/spaces/ughdotpe40cx
// 下部の HTTP HEADERS に下記追加する。SecretはContentfulのwebhook設定から利用。
// {"Authorization": "Bearer ~~~~~"}

// All Archive
export const limitSkipNum = 30
export const maxImportContent = 1000
// Contentful.ts の generateSearchQuery に 検索項目 として、下記反映すること
// type.d.tsに Type definition として、下記反映すること
export const query_archiveTopPlan =
  `{
    archiveTopPlan(id : "7jI2eBEKsn4DtCAyywY5O2"){
      sys{
        id
      }
      text
    }
  }
`