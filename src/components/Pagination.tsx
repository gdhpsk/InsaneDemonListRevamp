import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button, Flex, TextFieldInput } from "@radix-ui/themes";
import { useState } from "react";

interface IProps {
  page: number;
  count: number;
  onChange: (val: number) => void
}

const GROUP_MAX = 5; 
const half = Math.ceil(GROUP_MAX / 2)

export default function Pagination(props: IProps) {
  const { page, count, onChange } = props;
  let [typing, setTyping] = useState(false)
  let [typingPage, setTypingPage] = useState({type: "leading", page: 1})

  const getButton = (current: number) => 
    <Button key={current} variant={`${page === current? 'surface': 'soft'}`} onClick={() => onChange(current)}>
      {current}
    </Button>
  

  return (
    <div style={{display: "flex", alignItems: "center"}}>
      {
        count > 1 && <Button variant="ghost" disabled={page===1} onClick={() => page > 1 && onChange(page - 1)}>
          <ChevronLeftIcon style={{scale: 1.5, marginRight: "10px"}}/>
        </Button>
      }

      {
        count <= GROUP_MAX + 2 ?
          Array(count).fill(0).map((item, index)=> getButton(index + 1)) : 
          <>
            {getButton(1)}
            { page > 1 + half ? (!typing || typingPage.type != "trailing" ? <span className=" leading-10"  style={{marginLeft: "10px", marginRight: "10px"}} onClick={() => {
                setTyping(true)
                setTypingPage({type: "trailing", page: 1})
            }}>...</span> : <Flex>
                <TextFieldInput type='number' style={{width: "40px"}} onChange={(e) => setTypingPage({type: "trailing", page: parseInt(e.target.value as any)})} onKeyDown={e => {
                    if(e.key == 'Enter') {
                        setTyping(false)
                        if(typingPage.page < 1 || typingPage.page > 1 + half) { 
                            onChange(1)
                        } else {
                            onChange(typingPage.page)
                        }
                        setTypingPage({type: "leading", page: 1})
                    }
                }}></TextFieldInput>
                <Button variant="solid" onClick={() => {
                    setTyping(false)
                    if(typingPage.page < 1 || typingPage.page > 1 + half) { 
                        onChange(1)
                    } else {
                        onChange(typingPage.page)
                    }
                    setTypingPage({type: "leading", page: 1})
                }}><CheckIcon></CheckIcon></Button>
            </Flex>) : ""}
            { Array(GROUP_MAX).fill(0).map((item, index)=> {
              const p = page - half + index + 1
              return (p > 1 && p < count) ? getButton(p): ''
            })}
            { page < count - half ? (!typing || typingPage.type != "leading" ? <span className=" leading-10"  style={{marginLeft: "10px", marginRight: "10px"}} onClick={() => {
                setTyping(true)
                setTypingPage({type: "leading", page: 1})
            }}>...</span> : <Flex>
                <TextFieldInput type='number' style={{width: "40px"}} onChange={(e) => setTypingPage({type: "leading", page: parseInt(e.target.value as any)})} onKeyDown={e => {
                    if(e.key == 'Enter') {
                        setTyping(false)
                        if(typingPage.page < count - half || typingPage.page > count) {
                            onChange(count)
                        } else {
                            onChange(typingPage.page)
                        }
                        setTypingPage({type: "leading", page: 1})
                    }
                }}></TextFieldInput>
                <Button variant="solid" onClick={() => {
                    setTyping(false)
                    if(typingPage.page < count - half || typingPage.page > count) {
                        onChange(count)
                    } else {
                        onChange(typingPage.page)
                    }
                    setTypingPage({type: "leading", page: 1})
                }}><CheckIcon></CheckIcon></Button>
            </Flex>) : ""}
            {getButton(count)}
          </>
      }

      {
        count > 1 && <Button variant="ghost" disabled={page===count} onClick={() => page < count && onChange(page + 1)}>
          <ChevronRightIcon style={{scale: 1.5, marginLeft: "10px"}}/>
        </Button>
      }
    </div>
  );
}