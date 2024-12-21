'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {DatePickerWithRange} from "@/app/setup/CalendarComponent";



export default function Setup(){

    const [files , setFiles] = useState([]);
    const [fname , setFname] = useState([]);
    const [suggestion , setSuggestion] = useState<string>();
    const [weekdays , setWeekdays] = useState<string>();
    const [weekends , setWeekends] = useState<string>();
    const [startDate , setStartDate] = useState<string>();
    const [endDate , setEndDate] = useState<string>();
    const uploadFile = (e : any) =>{
        for (const item of e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(item);

            reader.onload = () => {
                console.log(item);
                // @ts-ignore
                setFiles((files) => [...files, reader.result]);
                // @ts-ignore
                setFname((fname) => [...fname, item.name]);
                console.log(files);
            };
            reader.onerror = () => {
                console.log(reader.error);
            };
        }
    }
    return (
        <div className="main w-full min-h-screen box-border p-50 flex flex-col justify-center items-center bg-gradient-to-r from-white to-gray-100">

            <div className="w-1/3 mt-50">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Syllabus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row">
                            <Input onChange={uploadFile} type='file' name={'file'} multiple/>
                        </div>
                        <div className={'flex flex-col pt-5'}>
                            {files.map((file, index) => {
                                return <div key={index}
                                            className={'flex flex-row justify-between items-center py-1 my-1 px-2 bg-gray-200 rounded-md line-clamp-1 '}>
                                    <Label
                                        className={'w-10/12 line-clamp-1'}
                                    >{fname[index]}</Label>
                                    <Button
                                        variant={'destructive'}
                                        onClick={() =>
                                            {
                                                setFiles((files) =>
                                                    files.filter((_, i) => i !== index)
                                                );
                                                setFname((fname) =>
                                                    fname.filter((_, i) => i !== index)
                                                );
                                            }
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            })
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-1/3 pt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Timings</CardTitle>
                        <CardDescription> Enter hours studied per day and length of semester</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Button type="submit" disabled>Weekdays</Button>
                            <Input type="number" placeholder="Hours"
                                onChange={(text) =>
                                    setWeekdays(text.target.value)
                                }
                            />
                        </div>
                        <div className="flex w-full max-w-sm items-center space-x-2 pt-5">
                            <Button type="submit" disabled>Weekends</Button>
                            <Input type="number" placeholder="Hours"
                                onChange={(text) => {
                                    setWeekends(text.target.value);
                                }}
                            />
                        </div>
                        <div className="flex flex-col w-full max-w-sm items-start pt-5">
                            <br/>
                            <CardTitle>
                                Semester Duration
                            </CardTitle>
                            <br/>
                            <DatePickerWithRange
                                onDataReturn={(value) => {
                                    console.log(value)
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-1/3 pt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Suggestions</CardTitle>
                        <CardDescription> Suggest custom features such as priority of each subject or that you want to AI keep in mind while creating the schedule</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input type="text" placeholder="Enter suggestions"
                            onChange={(text) => {
                                setSuggestion(text.target.value);
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="w-1/3 pt-10">
                <Button
                    className="w-full"
                >
                    Start Creating
                </Button>
            </div>

            <div className={'min-h-36'} />
        </div>
    );
}