interface TaskCheckBoxProps {
  id: string,
  name: string,
  course: string,
  date: string,
  timeRequired: number,
  isDone: boolean,
  handlerFunction: (id:string,value: boolean) => void
}

export default function TaskCheckBox({id,name,course,date,timeRequired,isDone,handlerFunction}: TaskCheckBoxProps) {
    return (
        <div className={"flex flex-row space-x-4 w-full"}>
            <input type="checkbox" className={"w-6 h-6"} checked={isDone} onChange={(value) => {handlerFunction(id,!!value)}}/>
            <div className={"flex flex-col space-y-1"}>
                <h3 className={"text-lg font-semibold"}>{name}</h3>
                <p className={"text-md"}>{course} - {date}</p>
            </div>
        </div>
    )
}