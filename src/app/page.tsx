import HomePage from './client'

export default async function Home() {

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admins`, {cache: "no-cache"})
  let admins = await req.json()
  
  return (
    <HomePage
      admins={admins}
    ></HomePage>
  )
}

export const revalidate = 0