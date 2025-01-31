interface ProgressCardProps {
  id: string,
  courseName: string,
  currentProgress: number,
  totalProgress: number,
  progressColor: string,
}
export default function ProgressCard({id,courseName,currentProgress,totalProgress,progressColor}: ProgressCardProps) {
    return (
        <div className={"flex flex-col space-y-4 bg-background-300 w-full p-5 m-2 rounded-2xl"}>
            <div className={"flex flex-row justify-between"}>
                <h3 className={"text-lg font-semibold"}>{courseName}</h3>
                <p className={"text-md"}>{currentProgress}/{totalProgress}</p>
            </div>
            <div className={"flex flex-row space-x-4"}>
                <div className={"w-full h-4 bg-background-400 rounded-full"}>
                    <div
                        className={"h-full rounded-full transition-all duration-300"}
                        style={{width: `${currentProgress/totalProgress*100}%`, backgroundColor: progressColor}}
                    />
                </div>
            </div>
        </div>
    )
}