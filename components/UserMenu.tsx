import NextLink from 'next/link';
import { UserIcon } from '@/styles/icons';
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button, Link, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { text_highlight_color } from '@/styles/colorModeValue'

export default function UserMenu() {

    const router = useRouter()
    const textHighlight_color = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<UserIcon width={7} height={7} color={router.route.includes('account') && textHighlight_color} />}
                bg='none'
                _expanded={{ bg: "none" }}
                _focus={{ bg: "none" }}
            />
            <MenuList zIndex='3'>
                <MenuItem><NextLink href="/account" passHref><Link w='full'>アカウント</Link></NextLink></MenuItem>
                <MenuItem><Link href="/api/auth/logout" w='full'>ログアウト</Link></MenuItem>
            </MenuList>
        </Menu>
    );
}