import Image from 'next/image'
import { Box } from "@chakra-ui/layout"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function SlickSlider({ imgs, h }) {

	const isLargerThan768 = useMediaQuery("(min-width: 768px)")
	const settings = {
		infinite: true,
		speed: 4000,
		fade: true,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 10000,
		slidesToScroll: 1,
	}

	return (
		<Slider {...settings}>
			{imgs.map(img => (
				<Box pos='relative' h={h} key={img.sys.id} transform={{ base: 'translateX(0px)', md: 'translateX(280px)', lg: 'translateX(400px)', xl: 'translateX(300px)' }}>
					<Image src={img.url}
						layout="fill"
						objectFit={isLargerThan768 ? 'contain' : 'cover'}
						quality={100}
						priority={true}
						alt='Archive app' />
				</Box>
			))
			}
		</Slider >
	)
}

// <Box h={h} w='full'>
// 				<Image src={img[0].url}
// 					layout="fixed"
// 					width={w}
// 					height={h}
// 					// objectFit="cover"
// 					quality={100}
// 					priority={true}
// 					alt='芝田美智子 ボタニカルアート' />
// 			</Box>