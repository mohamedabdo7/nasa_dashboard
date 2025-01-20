import { FC, useMemo, useState } from "react";
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

const OperationalRequests: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [listener, setListener] = useState(false);

  // Fetching data
  const url = "getOperationalRequestsForEmp"; // API endpoint for requests
  const { data, loading, count, setPageNumber, pageNumber } = useFetchTableData(
    searchValue,
    url,
    { search: searchValue },
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
      Header: t("requests.projectName"),
      accessor: i18n.language === "en" ? "project.nameEn" : "project.nameAr",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {i18n.language === "en"
              ? truncateString(row.original?.nameEn, false, 20)
              : truncateString(row.original?.nameAr, false, 20)}
          </span>
        </div>
      ),
    },
    // {
    //   Header: t("requests.requestType"),
    //   accessor: "type",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex">
    //       <span className="ms-2">{row.original.type}</span>
    //     </div>
    //   ),
    // },
    // {
    //   Header: t("requests.requestDescription"),
    //   accessor: "description",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex">
    //       <span className="ms-2">
    //         {truncateString(row.original.description, false, 30)}
    //       </span>
    //     </div>
    //   ),
    // },
    // {
    //   Header: t("requests.type"),
    //   accessor: "typeCategory",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex">
    //       <span className="ms-2">{row.original.typeCategory}</span>
    //     </div>
    //   ),
    // },
    // {
    //   Header: t("requests.status"),
    //   accessor: "status",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex">
    //       <span className="ms-2">
    //         {t(`requests.status.${row.original.status}`)}
    //       </span>
    //     </div>
    //   ),
    // },
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
          onEdit={
            () => {}
            // navigate(routes.EDITREQUEST.replace(":id", row.original.id))
          }
          onView={() => {
            navigate(
              routes.VIEWOPERATIONALREQUEST.replace(":id", row.original.id)
            );
          }}
          onDelete={() => {
            setSelectedRequest(row.original);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Container fluid>
      <Stack direction="vertical">
        {/* Search and Add Request Row */}
        <Row>
          <Col lg={10} md={12}>
            <SearchInput
              value={searchValue}
              type="text"
              leftIcon={<GoSearch />}
              inputMode="search"
              onChange={(e: any) => setSearchValue(e.target.value)}
              placeholder={t("requests.search")}
            />
          </Col>

          <Col md={12} lg={2}>
            <Button
              onClick={() => navigate(routes.ADDOPERATIONALREQUEST)}
              text={t("requests.addRequest")}
              type="button"
              style={{ height: "49.6px", fontSize: "14px", margin: "1rem 0" }}
            />
          </Col>
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
