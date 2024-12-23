'use client';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {DatePickerWithRange} from "@/app/setup/CalendarComponent";
import {addDays} from "date-fns";
import {createSch} from "@/app/setup/getInitialSchedule";
import Interceptors from "undici-types/interceptors";
import redirect = Interceptors.redirect;
import {useRouter} from "next/navigation";
import {up} from "@/app/setup/getTopics";


export default function Setup(){
    const router = useRouter();
    const [files , setFiles] = useState([]);
    const [fname , setFname] = useState([]);
    const [suggestion , setSuggestion] = useState<string>();
    const [weekdays , setWeekdays] = useState<string>();
    const [weekends , setWeekends] = useState<string>();
    const [startDate , setStartDate] = useState<Date>();
    const [endDate , setEndDate] = useState<Date>();

    interface DateCalculation {
        startDate: string | Date;
        endDate: string | Date;
    }

    const calculateTotalDays = ({ startDate, endDate }: DateCalculation): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Add 1 to include both start and end dates
        const diff = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
        console.log(days);
        return days;
    }

    function writeLocalStorage(){
        console.log('Writing to Local Storage');
        //EndDate
        localStorage.setItem('endDate', endDate.toString());
        //NextRefreshDate , 10 days after startDate
        localStorage.setItem('nextRefreshDate', addDays(startDate, 10).toString());

        //Hours
        localStorage.setItem('hours' , [weekdays,weekends].toString());
        //Files

        //Suggestion
        localStorage.setItem('suggestion', suggestion.toString());
        initSchedule().then(
            () => {
                router.push('/dashboard');
            }
        )
    }

    function echoLS(){
        //read files
        const rdFiles = localStorage.getItem('files');
        console.log(rdFiles);
        //convert files back to object array
        const filesArray = rdFiles?.split(',');
        console.log(filesArray);
    }
    async function uploadImages(imageFiles) {
        const userAgent = 'curl/7.68.0';

        for (const file of imageFiles.target.files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name)

            try {
                const response = await fetch('http://x0.at/', {
                    method: 'POST',
                    headers: {
                        'User-Agent': userAgent
                    },
                    body: formData,
                    mode:'no-cors'
                });

                if (response.ok) {
                    console.log(`Successfully uploaded ${file.name}`);
                } else {
                    //console.error(response);
                }
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
            }
        }
    }
    async function initSchedule(){
        const getTopics = await up(
            "https://x0.at/V1FB.jpeg",
            "https://x0.at/JHal.jpeg",
            "https://x0.at/e2ir.jpeg",
            "https://x0.at/UPxd.jpeg"
        );

        localStorage.setItem("syllabus", getTopics.toString());
        const response = await createSch(getTopics.toString(),startDate?.toString(),endDate?.toString(),weekdays?.toString());
        localStorage.setItem("initsch" , response);
    }

    const uploadFile = (e : any) =>{
        for (const item of e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(item);
            console.log(item);
            reader.onload = () => {
                console.log(URL.createObjectURL(item));
                // @ts-ignore
                setFiles((files) => [...files, reader.result]);
                // @ts-ignore
                setFname((fname) => [...fname, URL.createObjectURL(item)]);
                console.log(files);
            };
            reader.onerror = () => {
                console.log(reader.error);
            };
        }
    }
    return (
        <div className="main w-full min-h-screen box-border p-50 flex flex-col justify-center items-center bg-gradient-to-r from-white to-gray-100">
            <div className={"w-1/3 my-10"}>
                <h1
                    className="text-4xl font-bold"
                >Get Started</h1>
            </div>
            <div className="w-1/3 mt-50">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Syllabus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row">
                            <Input onChange={uploadImages} type='file' name={'file'} multiple/>
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
                                    setStartDate(value.from);
                                    setEndDate(value.to);
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
                    onClick={
                        () => {
                            console.log(startDate);
                            console.log(endDate);
                            if(startDate && endDate) {
                                calculateTotalDays({startDate,endDate});
                            }else {
                                alert("Please fill all columns");
                            }
                            writeLocalStorage();
                            echoLS();
                        }
                    }
                >
                    Start Creating
                </Button>
            </div>

            <div className={'min-h-36'} />
        </div>
    );
}