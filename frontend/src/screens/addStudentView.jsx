import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FormContainer from "../components/formContainer";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, updateStudent } from "../actions/studentActions";
import Loading from "../components/loader.jsx";
import Message from "../components/message.jsx";
import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";
import Loader from "../components/loader";

const AddStudentView = () => {
  const history = useHistory();

  const [uploading, setUploading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [image, setImage] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [status, setStatus] = useState("Hostel");

  const dispatch = useDispatch();
  const studentAdd = useSelector((state) => state.studentAdd);
  const { loading, error, success } = studentAdd;
  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: STUDENT_UPDATE_RESET });
      history.push("/");
    }
    if (history.location.state && history.location.state.studentProps) {
      setIsEdit(true);
      const student = history.location.state.studentProps;
      setName(student.name);
      setAddress(student.address);
      setCategory(student.category);
      setCity(student.city);
      setContact(student.contact);
      setFatherContact(student.fatherContact);
      setImage(student.image);
      setRoomNo(student.roomNo);
      setBlockNo(student.blockNo);
      setStatus(student.status);
    }
    if (success) {
      history.push("/");
    }
  }, [dispatch, history, success, successUpdate]);

 const uploadFileHandler = async (e) => {
  e.preventDefault();
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  setUploading(true);

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Upload response:", data);  // 👀 See imagePath
    setImage(data.imagePath);
  } catch (err) {
    console.error("Upload error:", err);
  } finally {
    setUploading(false);
  }
};

  const submitHandler = (e) => {
    e.preventDefault();
    const studentPayload = {
      name,
      address,
      category,
      city,
      contact,
      fatherContact,
      image,
      roomNo,
      blockNo,
      status,
    };

    if (isEdit === true) {
      const _id = history.location.state.studentProps._id;
      dispatch(updateStudent({ _id, ...studentPayload }));
    } else {
      dispatch(addStudent(studentPayload));
    }
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading || loadingUpdate ? (
        <Loader />
      ) : (
        <>
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          <FormContainer>
            <h1>{isEdit ? "Edit Student" : "Add Student"}</h1>
            {loading && <Loading />}
            {error && <Message variant="danger">{error}</Message>}

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {["Hostel", "Outside", "Home"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="contact">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="fatherContact">
                <Form.Label>Father Contact</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter father’s phone number"
                  value={fatherContact}
                  onChange={(e) => setFatherContact(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="roomNo">
                <Form.Label>Room No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Room no"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="blockNo">
                <Form.Label>Block Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Block Number"
                  value={blockNo}
                  onChange={(e) => setBlockNo(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={uploadFileHandler} />
                {uploading && <p>Uploading...</p>}
              </Form.Group>

              {image && (
                <img
                  src={`http://localhost:5000${image}`}
                  alt="Preview"
                  style={{ width: "150px", marginTop: "10px" }}
                />
              )}

              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Stream"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                {isEdit ? "Update" : "Add Student"}
              </Button>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default AddStudentView;