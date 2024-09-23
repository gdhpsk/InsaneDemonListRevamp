import Packs from './client';

export default async function RootLayout() {
    let [req1] = await Promise.all([
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`)
  ])

  let [leaderboards] = await Promise.all([
      await req1.json()
  ])

  return (
    <>
    <br></br>
        <Packs
            leaderboards={leaderboards}
        ></Packs>
    </>
  )
}

export const revalidate = 0