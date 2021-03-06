import Head from 'next/head'
import dynamic from "next/dynamic";
import styles from '../styles/Home.module.css'
import styled from "styled-components"
import { useRef, useState, useEffect } from 'react'
import { setup, draw } from "../components/sketch2"
import { useMeasure } from "react-use";
import { motion } from 'framer-motion';
const Sketch = dynamic(() => import("react-p5"), { ssr: false });

const HomeContainer = styled.div`
  min-height: 100vh;
  /*padding: 0 0.5rem;*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #262626;
  transition: all 1.0s ease;

  ${props => props.season == "winter" && ({
    backgroundColor: props.inView == "intro" ? "#8695c0" : "#ebebec",
    color: props.inView == "intro" ? "#e1e2e9" : "#474748"
  })}

${props => props.season == "summer" && ({
    backgroundColor: props.inView == "intro" ? "#d39e8e" : "#f1eae8",
    color: props.inView == "intro" ? "#eee6e3" : "#393737"
  })}

${props => props.season == "autumn" && ({
    backgroundColor: props.inView == "intro" ? "#cda05b" : "#f5f1e9",
    color: props.inView == "intro" ? "#efece7" : "#2b2b2b"
  })}

${props => props.season == "spring" && ({
    backgroundColor: props.inView == "intro" ? "#929d82" : "#ebede9",
    color: props.inView == "intro" ? "#e2e3df" : "#2e2e2e"
  })}
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 90%;
  position: fixed;
  top: 0;
  margin: 5vh 0;
`

const Title = styled.span`
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 200;
  font-size: 18px;
  color: #262626;
  opacity: ${props => props.inView == "intro" ? 0 : 1};
  transition: all 1.0s ease;

  @media (max-width: 768px) {
    font-size: 14px;
    max-width: 20%;
    margin-left: 5%;
  }
`

const DotHolder = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const Dot = styled.span`
  height: 20px;
  width: 20px;
  background-color: #C4C4C4;
  border-radius: 50%;
  display: inline-block;
`

const SmallDot = styled.span`
  height: 11px;
  width: 11px;
  margin: 5px 0;
  background-color: ${props => props.isActive ? "#C4C4C4": null};
  transition: background-color .25s;
  border: 2px solid #C4C4C4;
  border-radius: 50%;
  display: inline-block;
`

const DotLink = styled.a`
  scroll-behavior: smooth;
`

const Spacer = styled.span`
  display: inline-block;
  width: 24px;
`

const Footer = styled.div`
  font-family: 'Libre Franklin', sans-serif;
  position: absolute;
  bottom: 0%;
  opacity: ${props => props.visible == "intro" ? 1 : 0};
  transition: opacity 1s ease;
  font-size: 14px;
  //color: #8B8688;
  display: flex;
  flex-direction: column;
`

const MainHolder = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  /*display: flex;
  align-items: center;*/
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 80%;
    font-size: 12px;
  }
`

const PicHolder = styled.div`
  width: 500px;
  height: 600px;
  display: flex;
  /*display: flex;
  align-items: center;*/
  justify-content: space-between;

  @media (max-width: 768px) {
    position: absolute;
    opacity: ${props => props.opacity ? props.opacity : 1};
    z-index: -1;
    top: 20%;
    left: 0;
    height: 500px;
    width: 500px;
  }
`

const ScrollLine = styled.div`
  border-left: 2px solid;
  margin-top: 10px;
  height: 20px;
  position: relative;
  bottom: 0;
  left: 50%;

  @media (max-width: 764px) {
    height: 15px;
  }
`

const MainText = styled.div`
  width: 80%;
  height: 100%;
  margin-left: 10%;
  overflow: auto; /*..will introduce scroll bar when needed..*/
  scroll-snap-type: y mandatory;

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    font-size: 14px;
  }
`

const Snapper = styled.section`
  scroll-snap-align: ${props => props.snapAlign ? props.snapAlign : "start"};
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const FauxSnapper = styled.section`
  scroll-snap-align: ${props => props.snapAlign ? props.snapAlign : "start"};
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media (min-width: 769px) {
    display: none;
  }
`

const Header1 = styled.h1`
  margin: 0;
  padding: 0;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 18px;
  //color: #787475;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const ButtonHolder = styled.div`
  /*width: 20%;
  height: 100%;*/
  position: fixed;
  right: 5%;
  top: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const ProjText = styled.p`
  font-family: 'Libre Franklin', sans-serif;
`

const Credits = styled.p`
  margin: .5em 0;
`

const AnchorLink = ({itemName, active, intersection}) => {

  const [anchorTarget, setAnchorTarget] = useState(null);

  const intersecting = intersection == itemName;

  useEffect(() => {
    setAnchorTarget(document.getElementById(itemName));
  }, [itemName]);

  const handleClick = event => {
    event.preventDefault();
    anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return(
    <DotLink 
      href={`#${itemName}`}
      onClick={handleClick}
      ariaLabel={`Scroll to ${itemName}`}
    >
      <SmallDot isActive={intersecting} />
    </DotLink>
  )
}
/*
--------------------------------------------------------------------------
// Hook
--------------------------------------------------------------------------
*/
function useOnScreen(refs, options) {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.target.id);
      }, options
    );
    for (let i=0; i<refs.length; i++){
      if (refs[i].current) {
        observer.observe(refs[i].current);
      }
    }
    return () => {
      for (let i=0; i<refs.length; i++) {
        observer.unobserve(refs[i].current);
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}

/*
----------------------------------------------------------------------
//Date
----------------------------------------------------------------------
*/

let date = new Date();
const month = date.getMonth();

const seasoner = (month) => {
  let season = null;
  if (month < 2) {
    season = "winter";
  } else if (month < 5) {
    season = "spring";
  } else if (month < 8) {
    season = "summer"; 
  } else if (month < 11) {
    season = "autumn";
  } else {
    season = "winter";
  }
  return season;
}

const season = seasoner(month);

/*
----------------------------------------------------------------------
//Component export
----------------------------------------------------------------------
*/

//create your forceUpdate hook
function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function Home() {

  //set ref to scroll to
  const intro = useRef(null);
  const music = useRef(null);
  const other = useRef(null);
  const theTeam = useRef(null);

  const [theRefs, setRefs] = useState([intro,music,other,theTeam]);

  const holder = useRef(null);

  const options = {
    root: holder.current,
    rootMargin: '0px',
    threshold: 0.55
  }

  const intersection = useOnScreen(theRefs,options);

  const [canvasRef, {width, height}] = useMeasure();
  let measures = {width: width, height: height, intersector: intersection};
  var boundSetup = setup.bind(null,measures);
  console.log("width, height: ",width,height);

  return (
    
    <HomeContainer season={season} inView={intersection}>

      
      <Header>
        <Title inView={intersection}>ITP WEATHER BAND</Title>
        <DotHolder>
          <DotLink href="https://soundcloud.com/itp-weather-band">
            <Dot />
          </DotLink>
          <Spacer />
          <DotLink href="https://www.youtube.com/channel/UCe3Dx3kf--1eICcKGkuHcYw">
            <Dot />
          </DotLink>
        </DotHolder>
      </Header>

      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@200;600&display=swap" rel="stylesheet" />
        <title>Weather Band</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className={styles.main}>

        <PicHolder style={{minWidth:"45%",maxWidth:"45%",minHeight:"75vh"}} ref={canvasRef}>
          <Sketch setup={boundSetup} draw={draw}/>
        </PicHolder>
        <MainHolder>
          <MainText id={"textHolder"} ref={holder}>
            <FauxSnapper></FauxSnapper>
            <Snapper id={"intro"} ref={intro}>
              <Header1>ITP WEATHER BAND</Header1>
              <ProjText>
                Weather Band is an experimental band creating music with weather data collected from a DIY weather station. We built a DIY weather station system and created experimental instruments that turn the environmental data into music and visuals. We use sound and music as mediums for delivering information about our immediate environment through the auditory and visual sense. 
              </ProjText>
              <ProjText>
                The band consists of faculties, alums, and graduate students at New York University’s Interactive Telecommunications Program (NYU ITP). If you are interested in hosting our performances, using our weather data, or collaborating with us, please email us at itpweatherband@gmail.com. 
              </ProjText>
            </Snapper>
            <Snapper id={"music"} ref={music}>
              <Header1>PERFORMANCE AND MUSIC</Header1>
              <ProjText>
                Watch our performances:
              </ProjText>
              <ProjText>youtube link</ProjText>
              <ProjText>Listen to our music:</ProjText>
              <ProjText>soundcloud link
              </ProjText>
            </Snapper>
            <Snapper id={"other"} ref={other}>
              <Header1>OTHER PROJECTS</Header1>
              <ProjText>Here's one project</ProjText>
              <ProjText>Here's another project</ProjText>
              <ProjText>Here's a third</ProjText>
              <Header1>BEHIND THE STAGE</Header1>
              <ProjText>Project Github: https://github.com/ITPNYU/WeatherBand</ProjText>
            </Snapper>
            <Snapper id={"theTeam"} ref={theTeam}>
              <Header1>THE TEAM</Header1>
              <ProjText>
                <Credits>
                  Creative Director: Yeseul Song
                </Credits>
                <Credits>
                  Advising/Mentoring: Tom Igoe
                </Credits>
                <Credits>
                  Music Producer: Jesse Simpson
                </Credits>
                <Credits>
                  Performers: Arnab Chakravarty, Sid Chou, Schuyler deVos, Atchareeya Jattuporn (Name), Chun Song, Nuntinee Tansrisakul, Yiting Liu
                </Credits>
                <Credits>
                  Tech Support: Brent Bailey, Arnab Chakravarty, Yeseul Song, Tom Igoe
                </Credits>
                <Credits>
                  Website Design and Development: Schuyler deVos, Yichan Wang
                </Credits>
                <p>
                Thanks to: you, for visiting!
                </p>
              </ProjText>
            </Snapper>
          </MainText>
          <ButtonHolder>
            <AnchorLink itemName={"intro"} active={true} intersection={intersection} />
            <AnchorLink itemName={"music"} active={false} intersection={intersection} />
            <AnchorLink itemName={"other"} active={false} intersection={intersection} />
            <AnchorLink itemName={"theTeam"} active={false} intersection={intersection} />
          </ButtonHolder>
        </MainHolder>
        
      </main>

      <Footer visible={intersection}>
        SCROLL
        <ScrollLine />
      </Footer>


    </ HomeContainer>
  )
}

export const getStaticProps = () => {
  return {
    props: {
      buildTimestamp: Date.now()
    }
  }
}
