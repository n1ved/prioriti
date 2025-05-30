interface TaskCheckBoxProps {
  id: string,
  name: string,
  course: string,
  date: string,
  timeRequired?: number,
  isDone: boolean,
  handlerFunction: (id:string,value: boolean) => void
}

export default function TaskCheckBox({id,name,course,date,timeRequired,isDone,handlerFunction}: TaskCheckBoxProps) {
    return (
        <div className={"flex flex-row space-x-4 w-full py-2"}>
            <input type="checkbox" className={"w-6 h-6 appearance-none bg-white checked:bg-blue-500 rounded-2xl"} checked={isDone} onChange={(value) => {handlerFunction(id,!!value)}}/>
            <div className={"flex flex-col space-y-1"}>
                <h3 className={"text-xl font-semibold"}>{name}</h3>
                <p className={"text-md"}><span className={"bg-primary-200 py-1~ px-2 rounded-2xl"}>{course}</span> <span className={"bg-primary-200 py-0.5 px-2 rounded-2xl"}>{date}</span></p>
            </div>
        </div>
    )
}