"use client";
import { useEffect ,useState} from "react";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./page.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function LandingPage() {
  const[documentsUpload,setDocumentsUpload] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [weekdaysHours, setWeekdaysHours] = useState('');
  const [weekendHours, setWeekendHours] = useState('');
  const [specialPreferences, setSpecialPreferences] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const handleFileUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files) {
      const filesArray = Array.from(e.target.files);
      const pdfFiles= filesArray.filter(file => file.type === 'application/pdf');
      if(pdfFiles.length!== filesArray.length) {
        setMessage({ text: 'Please upload only PDF files.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }
      setDocumentsUpload(prev=> [...prev, ...pdfFiles]);
      setMessage({ text: 'Files uploaded successfully.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handlePdfUploadButton = () => {
    if (documentsUpload.length === 0) {
      setMessage({ text: 'Please select PDF files first.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    // Send PDFs to backend here
    setMessage({ text: 'PDFs uploaded to backend successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const removeDocument =(index:number)=>{
    setDocumentsUpload(prev => prev.filter((_, i) => i !== index));
    setMessage({ text: 'File removed successfully.', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({text: '', type: '' });
    if (!startDate || !endDate ){
      setMessage({ text: 'Please select both start and end dates.', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    if (startDate > endDate){
      setMessage({text:'End Date should be after Start Date', type: 'error'});
      setIsSubmitting(false);
      return;
    }
    try{
      const formData=new FormData();
      formData.append('startDate', startDate.toISOString());
      formData.append('endDate', endDate.toISOString());
      formData.append('weekdaysHours', weekdaysHours);
      formData.append('weekendHours', weekendHours);
      formData.append('specialPreferences', specialPreferences);
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }
      const result = await response.json();
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        router.push('/success');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ text: 'An error occurred while submitting the form.', type: 'error' });
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (documentsUpload.length > 0 || startDate || endDate || weekdaysHours || weekendHours || specialPreferences) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [documentsUpload, startDate, endDate, weekdaysHours, weekendHours, specialPreferences]);

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <h1>prioriti</h1>
      </nav>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.container} style={{ overflow: 'visible', height: 'auto', minHeight: 'calc(100vh - 6rem)' }}>
        {/* Left column - Guidelines and Upload Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className={styles.info_container}>
            <h2>Guidelines</h2>
            <div className={styles.info_card}>
              <ul>
                <li>Upload your PDF documents</li>
                <li>Set your available study hours</li>
                <li>Specify your semester duration</li>
                <li>Add any special preferences or requirements</li>
                <li>Submit your documents for processing</li>
                <li>We'll organize and prioritize your tasks</li>
              </ul>
            </div>
          </section>

          <section className={styles.upload_container}>
            <h2>Upload Documents</h2>
            <div className={styles.upload_card} style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  maxHeight: '37.5vh',
                  overflow: 'auto'
                }}>
            <div style={{
                  flex: '1',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '0'
                }}>
              <div className={styles.uploadArea}>
                <input 
                  type='file' 
                  id="documentUpload" 
                  accept=".pdf" 
                  multiple 
                  className={styles.fileInput} 
                  onChange={handleFileUpload} 
                />
                <label htmlFor="documentUpload" className={styles.uploadButton}>
                  Select PDFs to Upload
                </label>
              </div>
              
              {documentsUpload.length > 0 ? (
                <div className={styles.documentList} style={{ 
                  maxHeight: '10vh',
                  height: 'auto',
                  flex: '1',
                }}>
                  <h3>Uploaded Documents:</h3>
                  <ul>
                    {documentsUpload.map((file, index) => (
                      <li key={index} className={styles.documentItem}>
                        <span>{file.name}</span>
                        <button type="button" className={styles.removeButton} onClick={() => removeDocument(index)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ 
                  padding: '1.5rem', 
                  textAlign: 'center', 
                  color: '#ffffff', 
                  backgroundColor: 'var(--background-100)',
                  borderRadius: '8px',
                  margin: '1rem 0'
                }}>
                  <p>No files uploaded yet.</p>
                </div>
              )}
              </div>
              <button 
                type="button"
                className={styles.uploadButton}
                onClick={handlePdfUploadButton}
                style={{ 
                  marginTop: '1rem',
                  alignSelf: 'center',
                  marginBottom: '0.3rem',
                  flexShrink: 0,
                  //position:'fixed'
                }}
              >
                Upload PDFs
              </button>
            </div>
          </section>
        </div>

        {/* Right column - Get Started */}
        <section className={styles.upload_container}>
          <h2>Get Started</h2>
          <div className={styles.upload_card} style={{ 
            maxHeight: '78vh',
            height: 'auto',
            overflow:'hidden'
          }}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.timingSection}>
                <h3>Study Hours</h3>
                <div className={styles.timingInputs}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="weekdaysHours">Weekdays</label>
                    <input
                      id="weekdaysHours"
                      type="number"
                      required
                      min="0"
                      max="24"
                      value={weekdaysHours}
                      onChange={(e) => setWeekdaysHours(e.target.value)}
                      placeholder="Hours per day"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="weekendsHours">Weekends</label>
                    <input
                      id="weekendsHours"
                      type="number"
                      required
                      min="0"
                      max="24"
                      value={weekendHours}
                      onChange={(e) => setWeekendHours(e.target.value)}
                      placeholder="Hours per day"
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.semesterSection}>
                <h3>Semester Duration</h3>
                <div className={styles.datePickerContainer}>
                  <div className={styles.datePickerWrapper}>
                    <label>Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      required
                      endDate={endDate}
                      placeholderText="Select start date"
                      className={styles.datePicker}
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                  <div className={styles.datePickerWrapper}>
                    <label>End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || undefined}
                      required
                      placeholderText="Select end date"
                      className={styles.datePicker}
                      dateFormat="MMM d, yyyy"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.preferences}>
                <h3>Special Preferences</h3>
                <textarea
                  value={specialPreferences}
                  onChange={(e) => setSpecialPreferences(e.target.value)}
                  className={styles.textArea}
                  placeholder="Enter your special preferences or additional requirements here..."
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}