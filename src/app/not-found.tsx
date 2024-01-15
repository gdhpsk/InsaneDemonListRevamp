import InfoCard from '@/components/InfoCard'
import { Avatar, Box, Card, Flex, Grid, Text } from '@radix-ui/themes'

export default async function NotFound() {
  return (
    <main>
        <br></br>
      <Text as="p" align="center" weight="bold" size="9">404 NOT FOUND</Text>
      <br></br>
      <Text as="p" align="center" weight="bold" size="7">The page you were looking for could not be found.</Text>
    </main>
  )
}
