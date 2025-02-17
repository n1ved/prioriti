'use client'
import styles from "./page.module.css";
import dummyProgressData from "@/data/DummyData/progress";
import dummyCoursesData from "@/data/DummyData/courses";
import dummyTaskData from "@/data/DummyData/tasks";
import React from "react";
import ProgressCard from "@/components/progress/ProgressCard";
import TaskCheckBox from "@/components/checkbox/TaskCheckBox";
interface Task {
    id: string,
    name: string,
    course: string,
    date: string,
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
  const [doneTasks, setDoneTasks] = React.useState(taskData.done);
  const [todoTasks, setTodoTasks] = React.useState(taskData.todo);


  const mappedTasks: Array<courseMappedTasks> = coursesData.map(course => {
    return {
      course: course,
      tasks: taskData.todo.filter(task => task.course === course)
    }
  });
  

  //TODO:This function is a mess
  const handleTaskStatusChange = (id:string,value:boolean) => {
    console.debug(`Task with id ${id} is now ${value ? 'done' : 'not done'}`);
    if(value){
        const changedTask = todoTasks.find(task => task.id === id);
        if(changedTask){
            setDoneTasks([...doneTasks,changedTask]);
            setTodoTasks(todoTasks.filter(task => task.id !== id));
        }
    } else {
      const changedTask = doneTasks.find(task => task.id === id);
      if (changedTask) {
        setTodoTasks([...todoTasks, changedTask]);
        setDoneTasks(doneTasks.filter(task => task.id !== id));
      }
    }
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
                        <div key={course.course} className={styles.checklist_card}>
                            <h3>{course.course}</h3>
                            {course.tasks.map((task) => (
                                <TaskCheckBox key={task.name} {...task} isDone={false} handlerFunction={handleTaskStatusChange}/>
                            ))}
                        </div>
                    ))}
                    {doneTasks.map((task,index) => (
                        <TaskCheckBox key={task.name} {...task} isDone={true} handlerFunction={handleTaskStatusChange}/>
                  ))}
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