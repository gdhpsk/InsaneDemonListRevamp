import InfoCard from '@/components/InfoCard'
import { Avatar, Box, Card, Flex, Grid, Text } from '@radix-ui/themes'

export default function Home() {
  return (
    <main>
      <br></br>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
        <img src="https://insanedemonlist.com/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>The Insane Demon List</Text>
        <img src="https://insanedemonlist.com/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">The Official Demonlist that has insane demons ranked based on difficulty!</Text>
      <Grid columns="2" gap="9" style={{marginTop: "60px", padding: "50px", maxWidth: "1400px", margin: "auto"}}>
        <Box>
          <Text className='header' size="8" align="left">Rules</Text>
          <br></br>
          <Text size="4">We have officially adopted most of the Pointercrate demonlist's guidelines, which you can find here. This means that your record must be acceptable on Pointercrate for it to be acceptable on this list! However, we also have some extra rules, specific to IDL, as well as some leniency changes:</Text>
          <br></br><br></br>
<Text size="4">- The level must be Rated "Insane Demon" for at least a week in order to be added. Also, a level needs to be rated to another difficulty for a week in order to be removed from the list. Levels that have been removed for a week will be seen at the "Removed Levels" section, which can be found at the bottom of the legacy list.</Text>
<br></br>
<Text size="4">- You are REQUIRED to have audible clicks/taps for the entire completion for it to be accepted. If you play on mobile and can not record your taps, you can enable the show taps settings on your phone.</Text>
<br></br>
<Text size="4">- Raw footage is not required, but feel free to submit it, especially if your clicks/taps are difficult to hear on your completion.</Text>
<br></br>
<Text size="4">- If you use a customized LDM for the level, we will review it ourselves and judge if it it acceptable. If you are uncertain whether or not it is acceptable, feel free to ask us in our Discord server.</Text>
<br></br>
<Text size="4">- Please do not submit multiple records of the same record (don't submit dupes)!</Text>
<Box style={{marginTop: "40px"}}>
<Text className='header' size="8" align="left">Discord Server</Text>
<br></br>
<Card style={{ marginTop: "15px", width: "fit-content", padding: "20px" }}>
  <Grid>
  <Text size="7" as="p" align="center"><a href="https://discord.gg/AyDPzBQc" target="_blank" style={{textDecoration: "none"}}>Insane Demon List Discord</a></Text>
  <br></br>
<iframe src="https://discord.com/widget?id=820784322456977438&theme=dark" width="350" height="500" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
<br></br>
<Text size="1" style={{maxWidth: "350px"}}>If you wanna join our amazing discord community or want to DM the staff personally about something, you can join by clicking the link!</Text>
  </Grid>
  </Card>
</Box>
        </Box>
        <Box>
        <Text className='header' size="7" align="left">List Leaders</Text>
        <Flex wrap="wrap" gap="3">
        <InfoCard
              name="Willow"
              tag="iwillowi"
              channel="https://www.youtube.com/channel/UCc9p_PkgCJ4srLMyQ7617rw"
              avatar="https://cdn.discordapp.com/avatars/953039415175954492/17434a608620d0a340fd89e8c915a110.png?size=1024"
            ></InfoCard>
        </Flex>
        <Text className='header' size="7" align="left" style={{marginTop: "30px"}}>List Moderators</Text>
        <Flex wrap="wrap" gap="3">
          <InfoCard
              name="Wolvyy"
              tag="wolvyy"
              avatar="https://cdn.discordapp.com/avatars/321706341695488001/0c37140a4bd21ead837c1b5b614f0b3a.png?size=1024"
              channel="https://www.youtube.com/channel/UCQgsAnHQx7c4DuVp7ZwFwOw"
            ></InfoCard>
          </Flex>
          <Text className='header' size="7" align="left" style={{marginTop: "30px"}}>List Helpers</Text>
          <Flex wrap="wrap" gap="3">
          <InfoCard
              name="rose"
              tag="rosedash"
              channel="https://www.youtube.com/channel/UCwV66xmIm8flp9q-crhwCnw"
              avatar="https://cdn.discordapp.com/avatars/327717701130780673/32dee5dd4b7612d2e392780328536d7f.png?size=1024"
            ></InfoCard>
          </Flex>
          <Text className='header' size="7" align="left" style={{marginTop: "30px"}}>Developers</Text>
          <Flex wrap="wrap" gap="3">
            <InfoCard
              name="Hpsk"
              tag="gdhpsk"
              avatar="https://cdn.discordapp.com/avatars/703364595321929730/a_d19ef817b89dc3781c5b27c2f3338ec8.gif?size=1024"
              channel="https://www.youtube.com/channel/UCnlpzjbXM19xJJSdY8ztd_A"
            ></InfoCard>
            <InfoCard
              name="jill"
              tag="oatmealine"
              avatar="https://cdn.discordapp.com/avatars/276416332894044160/b4752bed385775ba06da0e3757208d4e.png?size=1024"
              channel="https://oat.zone/"
            ></InfoCard>
          </Flex>
        </Box>
      </Grid>
    </main>
  )
}
