import { FC, useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getOneService, updateService } from "../../../services";
import { showToast } from "../../../utils";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../constants";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";

const EditService: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get the service id from the URL params
  const navigate = useNavigate();

  const breadcrumbItems = [
    { text: t("services.ourServices"), link: routes.SERVICES },
    { text: t("services.editService") },
  ];

  const [serviceData, setServiceData] = useState<{
    id: string;
    title: string;
    body: string;
    icon: string;
  }>({ id: "", title: "", body: "", icon: "" }); // Initialize with default values
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch service data on component mount
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await getOneService(id!); // Replace with your actual service API call
        console.log("Fetching service data...", response);
        setServiceData(response.data); // Set all fields including title, body, and id
      } catch (error) {
        console.error("Error fetching service data:", error);
        showToast("Error fetching service data", "error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, []); // Run once when the component is mounted

  // Handle input changes for title and body
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle icon image change
  const handleImageChange = (imageUrl: string | null) => {
    setServiceData((prevData) => ({
      ...prevData,
      icon: imageUrl || "", // If imageUrl is null, set the icon as an empty string
    }));
  };

  // Handle save (update service data)
  const handleSave = async () => {
    if (serviceData.body.trim() === "" || serviceData.title.trim() === "") {
      showToast("Both title and body cannot be empty", "error"); // Show error toast if title or body is empty
      return;
    }

    setLoading(true);
    try {
      await updateService(serviceData.id, {
        body: serviceData.body,
        title: serviceData.title,
        icon: serviceData.icon, // Make sure to include the icon data
      });
      showToast("Service updated successfully", "success"); // Success toast
      navigate(routes.SERVICES); // Redirect after success
    } catch (error) {
      console.error("Error updating service:", error);
      showToast("Error updating service", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center  h-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <SectionContainer header="Edit Service Information">
            <ImageUpload
              name="icon"
              initialImageUrl={serviceData.icon}
              onImageChange={handleImageChange} // Use the refactored image change handler
              isEditMode
            />
            <Row>
              <Col lg={12}>
                <Input
                  type="text"
                  name="title"
                  labelName={t("inputs.title")}
                  placeholder={t("placeholder.enterTitle")}
                  required
                  value={serviceData.title}
                  onChange={handleInputChange}
                />
              </Col>
              <Col lg={12}>
                <Input
                  type="text"
                  name="body"
                  labelName={t("inputs.body")}
                  placeholder={t("placeholder.enterBody")}
                  required
                  isTextArea
                  value={serviceData.body}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </SectionContainer>

          <Row className="d-flex justify-content-end gy-2">
            <Col lg={3}>
              <Button
                text={t("buttons.save")}
                onClick={handleSave}
                loading={loading}
                // disabled={
                //   serviceData.body.trim() === "" || serviceData.title.trim() === ""
                // } // Disable button if any field is empty
              />
            </Col>
            <Col lg={3}>
              <Button text={t("buttons.cancel")} styleType="outline" />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default EditService;
