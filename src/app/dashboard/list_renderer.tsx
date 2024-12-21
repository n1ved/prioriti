'use client';

import {useEffect, useState} from 'react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    const [topics, setTopics] = useState(
        data[0].courses.flatMap((course) =>
            course.topics.map((topic, index) => ({
                id: `topic-${index}`,
                label: `${topic.topic_name} (${topic.time})`,
                checked: false
            }))
        )
    );

    useEffect(() => {
        setTopics(
            data[0].courses.flatMap((course) =>
                course.topics.map((topic, index) => ({
                    id: `topic-${index}`,
                    label: `${topic.topic_name} (${topic.time})`,
                    checked: false
                }))
        ))
    }, [data]);

    const handleEditLabel = (id: string, newLabel: string) => {
        setTopics(topics.map(topic =>
            topic.id === id ? { ...topic, label: newLabel } : topic
        ));
    };

    const handleDeleteItem = (id: string) => {
        setTopics(topics.filter(topic => topic.id !== id));
    };

    return (
        <FormItem>
            <div className="mb-4">
                <FormLabel className="text-base">
                    {data[0].courses[0].course_name}
                </FormLabel>
                <FormDescription>
                    These are the topics to be studied today
                </FormDescription>
            </div>
            <div className="flex flex-col flex-wrap gap-4 w-[500px]">
                {topics.map((topic) => (
                    <FormField
                        key={topic.id}
                        name="topics"
                        render={({ field }) => (
                            <FormItem
                                key={topic.id}
                                className="flex flex-row flex-wrap items-center space-x-3 space-y-0 min-w-[300px]"
                            >
                                <FormControl>
                                    <Checkbox
                                        checked={topic.checked}
                                        onCheckedChange={(checked) => {
                                            setTopics(topics.map(t =>
                                                t.id === topic.id ? { ...t, checked: !!checked } : t
                                            ));
                                        }}
                                    />
                                </FormControl>
                                <Input
                                    value={topic.label}
                                    onChange={(e) => handleEditLabel(topic.id, e.target.value)}
                                    className="flex flex-col flex-wrap w-[400px]"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteItem(topic.id)}
                                >
                                    Delete
                                </Button>
                            </FormItem>
                        )}
                    />
                ))}
            </div>
            <FormMessage />
        </FormItem>
    );
}
