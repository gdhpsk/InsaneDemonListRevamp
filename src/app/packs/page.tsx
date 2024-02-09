import Packs from './client';

export default async function RootLayout() {

    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/packs`)
    let packs = await req.json()

  return (
    <>
    <br></br>
        <Packs
            packs={packs}
        ></Packs>
    </>
  )
}

export const revalidate = 0