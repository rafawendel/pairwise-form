import Head from 'next/head'
import './index.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>Paleta GEDAAM</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>
  )
}
