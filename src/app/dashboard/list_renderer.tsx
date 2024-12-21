'use client';

import {useEffect, useState} from 'react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {useContext} from "react";
import {SharedDataContext} from "@/app/dashboard/layout";
import {Share} from "lucide-react";

interface Topic {
    topic_name: string;
    time: string;
}

interface Course {
    course_name: string;
    topics: Topic[];
}

interface DaySchedule {
    date: string;
    courses: Course[];
}

export function ScheduleComponent({ data }: { data: DaySchedule[] }) {

    const {curDate , setCurDate , count , setCount , totalCount , setTotalCount } = useContext(SharedDataContext);

    const [courseTopics, setCourseTopics] = useState(
        data[0].courses.map((course, courseIndex) => ({
            courseName: course.course_name,
            topics: course.topics.map((topic, topicIndex) => ({
                id: `topic-${courseIndex}-${topicIndex}`,
                label: `${topic.topic_name} (${topic.time})`,
                checked: false
            }))
        }))
    );
    useEffect(() => {
        data[0].courses.map((course) => {
            setTotalCount(totalCount + course.topics.length);
        });
    }, []);

    useEffect(() => {
        setTotalCount(0);
        setCourseTopics(
            data[0].courses.map((course, courseIndex) => ({
                courseName: course.course_name,
                topics: course.topics.map((topic, topicIndex) => ({
                    id: `topic-${courseIndex}-${topicIndex}`,
                    label: `${topic.topic_name} (${topic.time})`,
                    checked: false
                }))
            }))
        );
    }, [data]);

    const handleEditLabel = (courseIndex: number, topicId: string, newLabel: string) => {
        setCourseTopics(courseTopics.map((course, idx) =>
            idx === courseIndex ? {
                ...course,
                topics: course.topics.map(topic =>
                    topic.id === topicId ? { ...topic, label: newLabel } : topic
                )
            } : course
        ));
    };

    const handleDeleteItem = (courseIndex: number, topicId: string) => {
        setCourseTopics(courseTopics.map((course, idx) =>
            idx === courseIndex ? {
                ...course,
                topics: course.topics.filter(topic => topic.id !== topicId)
            } : course
        ));
    };

    return (
        <div className="space-y-6">
            {courseTopics.map((course, courseIndex) => (
                <FormItem key={`course-${courseIndex}`}>
                    <div className="mb-4">
                        <FormLabel className="text-base">
                            {course.courseName}
                        </FormLabel>
                        <FormDescription>
                            These are the topics to be studied today
                        </FormDescription>
                    </div>
                    <div className="flex flex-col flex-wrap gap-4 w-[500px]">
                        {course.topics.map((topic) => (
                            <FormField
                                key={topic.id}
                                name={`topics-${courseIndex}`}
                                render={({ field }) => (
                                    <FormItem
                                        key={topic.id}
                                        className="flex flex-row flex-wrap items-center space-x-3 space-y-0 min-w-[300px]"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={topic.checked}
                                                onCheckedChange={(checked) => {
                                                    setCourseTopics(courseTopics.map((c, idx) =>
                                                        idx === courseIndex ? {
                                                            ...c,
                                                            topics: c.topics.map(t =>
                                                                t.id === topic.id ? { ...t, checked: !!checked } : t
                                                            )
                                                        } : c
                                                    ));
                                                }}
                                            />
                                        </FormControl>
                                        <Input
                                            value={topic.label}
                                            onChange={(e) => handleEditLabel(courseIndex, topic.id, e.target.value)}
                                            className="flex flex-col flex-wrap w-[400px]"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteItem(courseIndex, topic.id)}
                                        >
                                            Delete
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    {courseIndex < courseTopics.length - 1 && <Separator className="my-4" />}
                    <FormMessage />
                </FormItem>
            ))}
        </div>
    );
}
