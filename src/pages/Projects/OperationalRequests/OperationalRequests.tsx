import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import ActionsMenu from "../../../components/UI/ActionsMenu/ActionsMenu";
import { routes } from "../../../constants";
import SearchInput from "../../../components/UI/SearchInput/SearchInput";
import Button from "../../../components/UI/Button";
import TableComponent from "../../../components/Table/TableComponent";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import { FaExclamationCircle } from "react-icons/fa";
import { i18n, showToast } from "../../../utils";
// import { deleteRequest } from "../../../services";
import { truncateString } from "../../../utils/truncateString";

import PaginatedSelect from "../../../components/PaginatedSelect/PaginatedSelect"; // Assuming PaginatedSelect exists
import {
  getProjects,
  getProjectsForConsultant,
  getProjectsForEmp,
} from "../../../services"; // API service to fetch projects
import { useAuth } from "../../../context/AuthContext";

const OperationalRequests: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [listener, setListener] = useState(false);

  // For project filtering
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string | null>("");

  // Fetching data
  const url =
    user.type === "Employee"
      ? "getGlobalOperationalRequestsForEmp"
      : user.type === "Consultant"
      ? "getGlobalOperationalRequestsForCons"
      : "getGlobalOperationalRequests"; // API endpoint for projects
  const { data, loading, count, setPageNumber, pageNumber } = useFetchTableData(
    searchValue,
    url,
    { search: searchValue, id: projectId },
    listener
  );

  const memoizedData = useMemo(() => data, [data]);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;

    setDeleteLoading(true);
    try {
      // Call the API service to delete the request
      //   await deleteRequest(selectedRequest.id);

      // Trigger re-fetching of table data after successful deletion
      setListener(!listener);

      // Close the modal after deletion
      handleModalClose();

      // Show success message
      showToast(t("requests.requestDeleted"), "success");
    } catch (error) {
      console.error("Failed to delete request:", error);

      // Show error message if the deletion fails
      showToast(t("requests.deleteFailed"), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchProjects = async (page: number, search = "") => {
    console.log("page", search);

    try {
      let response;

      // Decide API based on user type
      if (user.type === "Employee") {
        response = await getProjectsForEmp({ pageNumber: page, limit: 10 });
      } else if (user.type === "Consultant") {
        response = await getProjectsForConsultant({
          pageNumber: page,
          limit: 10,
        });
      } else {
        response = await getProjects({ pageNumber: page, limit: 10 });
      }

      const newOptions = response.data.rows.map((project: any) => ({
        value: project.id,
        label: project.nameEn || project.nameAr,
      }));

      setProjectOptions((prevOptions) => {
        const existingIds = new Set(prevOptions.map((opt) => opt.value));
        return [
          ...prevOptions,
          ...newOptions.filter((opt: any) => !existingIds.has(opt.value)),
        ];
      });

      return newOptions;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  // Table columns definition
  const columns = [
    {
      Header: t("requests.requestId"),
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {truncateString(row.original.id, i18n.language !== "en", 10)}
          </span>
        </div>
      ),
    },
    {
      Header: t("requests.code"),
      accessor: "code",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">{row.original?.code}</span>
        </div>
      ),
    },
    {
      Header: t("requests.creationDate"),
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      Header: "",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <ActionsMenu
          // onEdit={() => {}}
          onView={() => {
            navigate(
              routes.VIEWOPERATIONALREQUEST.replace(":id", row.original.id)
            );
          }}
          // onDelete={() => {
          //   setSelectedRequest(row.original);
          //   setModalOpen(true);
          // }}
        />
      ),
    },
  ];

  return (
    <Container fluid>
      <Stack direction="vertical">
        {/* Search and Filter Row */}
        <Row className="align-items-center mb-3">
          <Col lg={12} md={12}>
            <SearchInput
              value={searchValue}
              type="text"
              leftIcon={<GoSearch />}
              inputMode="search"
              onChange={(e: any) => setSearchValue(e.target.value)}
              placeholder={t("requests.search")}
            />
          </Col>
          <Col lg={8} md={12}>
            <PaginatedSelect
              labelName={t("requests.filterByProject")}
              options={projectOptions}
              loadMoreOptions={fetchProjects} // Fetch projects dynamically
              placeholder={t("requests.selectProject")}
              onChange={(value: any) => {
                setProjectId(value?.value || null);
                setListener(!listener);
              }} // Update projectId
              labelBackgroundColor="#ebf0ff"
            />
          </Col>
          {/* {user.type === "Admin" && ( */}
          <Col md={12} lg={4}>
            <Button
              onClick={() => navigate(routes.ADDOPERATIONALREQUEST)}
              text={t("requests.addRequest")}
              type="button"
              style={{ height: "49.6px", fontSize: "14px", margin: "1rem 0" }}
            />
          </Col>
          {/* )} */}
        </Row>

        {/* Loading Spinner or Table */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" />
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={memoizedData || []}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageCount={Math.ceil(count / 10)}
            enableSorting={true}
          />
        )}
      </Stack>

      {/* Delete Request Modal */}
      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleDeleteRequest}
          modalTitle={t("requests.deleteRequest")}
          modalMessage={`${t("requests.deleteMsg")} “${selectedRequest?.id}“?`}
          confirmBtnText={t("buttons.delete")}
          cancelBtnText={t("buttons.cancel")}
          loading={deleteLoading}
          Icon={<FaExclamationCircle color="#dc3545" size={20} />}
        />
      )}
    </Container>
  );
};

export default OperationalRequests;
