import Packs from './client';

export default async function RootLayout() {
    let [req1, req2] = await Promise.all([
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/packs`),
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`)
  ])

  let [packs, leaderboards] = await Promise.all([
      await req1.json(),
      await req2.json()
  ])

  return (
    <>
    <br></br>
        <Packs
            packs={packs}
            leaderboards={leaderboards}
        ></Packs>
    </>
  )
}

export const revalidate = 0