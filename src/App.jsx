import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";

const baseURL = "https://api.kairos.com";

function App() {
  const [count, setCount] = useState(0);
  const uploader = Uploader({ apiKey: "free" });
  const [fileUrl, setFileUrl] = useState(null);
  const [people, setPeople] = useState([]);
  const [data, setData] = useState();

  const processImage = async () => {
    setPeople([]);

    const postData = {
      image: fileUrl[0].fileUrl,
      gallery_name: "upl-test",
      threshold: 0.62,
    };

    const config = {
      method: "post",
      url: `${baseURL}/recognize`,
      headers: {
        "Content-Type": "application/json",
        app_id: "e23daf41",
        app_key: "36b2d154f0157fd0e23c62d3979337e1",
      },
      data: JSON.stringify(postData),
    };

    await axios(config).then((response) => {
      console.log("Response is", response);
      setData(response.data);
      setCount(0);
    });
  };

  const startRecognition = async () => {
    data?.images.map((item) => {
      if (item.candidates !== undefined) {
        setPeople((prevPeople) => [
          ...prevPeople,
          item?.candidates[0]?.subject_id,
        ]);

        console.log(item?.candidates[0]?.subject_id);
      }
    });
  };

  return (
    <>
      <div className="App">
        <h1>UPL Face Recognition Test</h1>
      </div>
      <UploadButton
        uploader={uploader}
        options={{ multi: false }}
        onComplete={(files) => {
          setFileUrl(files);
          setCount(2);
          //console.log(files);
        }}
      >
        {({ onClick }) => <button onClick={onClick}>Upload a file...</button>}
      </UploadButton>

      {count > 0 ? <p>The file URL is: {fileUrl[0].fileUrl}</p> : ""}

      {fileUrl ? (
        <div>
          <img src={fileUrl[0].fileUrl} alt="new" />
        </div>
      ) : (
        ""
      )}
      {count > 0 ? (
        <button onClick={processImage}>Send Image to Server</button>
      ) : (
        ""
      )}
      {data && people.length == 0 ? (
        <button onClick={startRecognition}>Start Recognition Process</button>
      ) : (
        ""
      )}
      {people && count == 0 ? (
        <p>
          {people.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </p>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
