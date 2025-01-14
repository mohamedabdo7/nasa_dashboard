import { FC, useState, useEffect } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row, Spinner } from "react-bootstrap";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button";
import { useTranslation } from "react-i18next";
import { getServiceBody, updateServiceBody } from "../../services"; // Import service functions
import { showToast } from "../../utils";

const ServicesInfo: FC = () => {
  const { t } = useTranslation();
  const [serviceData, setServiceData] = useState<{ id: string; body: string }>({
    id: "",
    body: "",
  }); // Initialize with default values
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch service data on component mount
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await getServiceBody(); // Get the service data
        setServiceData(response.data); // Set the body and id
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

  // Handle input change for body field
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save (update service data)
  const handleSave = async () => {
    if (serviceData.body.trim() === "") {
      showToast("Body cannot be empty", "error"); // Show error toast if body is empty
      return;
    }

    setLoading(true);
    try {
      await updateServiceBody(serviceData.id, {
        body: serviceData.body,
      });
      showToast("Service updated successfully", "success"); // Success toast
    } catch (error) {
      console.error("Error updating service:", error);
      showToast("Error updating service", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center  h-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <SectionContainer header="Service Information">
            <Row>
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
                disabled={serviceData.body.trim() === ""} // Disable button if body is empty
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

export default ServicesInfo;
