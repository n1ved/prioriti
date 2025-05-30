'use client'
import styles from "./page.module.css";
import dummyProgressData from "@/data/DummyData/progress";
import dummyCoursesData from "@/data/DummyData/courses";
import dummyTaskData from "@/data/DummyData/tasks";
import React, {useEffect} from "react";
import ProgressCard from "@/components/progress/ProgressCard";
import TaskCheckBox from "@/components/checkbox/TaskCheckBox";
import {ChevronRight , ChevronDown} from 'lucide-react'
interface Task {
    id: string,
    name: string,
    course: string,
    date: string,
    isDone: boolean,
    timeRequired: number,
}
interface courseMappedTasks {
  course: string,
  tasks: Array<Task>
}
export default function Dashboard() {
  const progressData = dummyProgressData();
  const coursesData = dummyCoursesData();

  const [taskData, setTaskData] = React.useState(dummyTaskData());
  const [doneTasks, setDoneTasks] = React.useState(taskData.filter(task => task.isDone));
  const [todoTasks, setTodoTasks] = React.useState(taskData.filter(task => !task.isDone));
  const [scaffoldDone , setScaffoldDone] = React.useState(false);
  const [mappedTasks , setMappedTasks] = React.useState(coursesData.map(course => {
      return {
          course:course,
          tasks: taskData.filter(task => task.course === course && !task.isDone),
      }
  }))




  useEffect(() => {
      setDoneTasks(taskData.filter(task => task.isDone));
      setTodoTasks(taskData.filter(task => !task.isDone));
      setMappedTasks(coursesData.map(course => {
          return {
              course:course,
              tasks: taskData.filter(task => task.course === course && !task.isDone),
          }
      }))
  },[taskData]);
  

  //TODO:This function is a mess
  const handleTaskStatusChange = (id:string,value:boolean) => {
    console.debug(`Task with id ${id} is now ${value ? 'done' : 'not done'}`);
    setTaskData(prevState => prevState.map(
        task => task.id === id ? {...task , isDone: value} : task
    ))
  }

  return (
      <main className={styles.main}>
            <nav className={styles.nav}>
              <h1>prioriti</h1>
            </nav>
            <div className={styles.container}>
              <section className={styles.checklist_container}>
                <h2>Checklist</h2>
                <div className={styles.checklist_cards}>
                    {mappedTasks.map((course) => (
                        course.tasks.length > 0 && (
                            <div key={course.course} className={styles.checklist_card}>
                                <h3 className={styles.checklist_course_title}>{course.course}</h3>
                                {course.tasks.map((task) => (
                                    <TaskCheckBox key={task.name} {...task} isDone={task.isDone} handlerFunction={handleTaskStatusChange}/>
                                ))}
                            </div>
                        )
                    ))}
                    <h3 className={styles.checklist_course_title} onClick={() => {setScaffoldDone(!scaffoldDone)}}> {scaffoldDone ? <ChevronDown/> : <ChevronRight/>} Completed Tasks</h3>
                    {
                        scaffoldDone &&
                        <div className={styles.checklist_cards_done}>
                            {doneTasks.map((task,index) => (
                                <TaskCheckBox key={task.name} {...task} isDone={task.isDone} handlerFunction={handleTaskStatusChange}/>
                            ))}
                        </div>
                    }
                </div>
              </section>
              <section className={styles.progress_container}>
                <h2>Today's Tasks</h2>
                <div className={styles.progress_cards}>
                  <ProgressCard
                        id="CST301"
                        courseName="Computer Graphics"
                        currentProgress={1}
                        totalProgress={3}
                        progressColor="#FFD700"
                  />
                </div>
                <h2>Total Progress</h2>
                <div className={styles.progress_cards}>
                  {progressData.map((data) => (
                      <ProgressCard key={data.id} {...data} />
                  ))}
                </div>
              </section>
            </div>
      </main>
  )
}