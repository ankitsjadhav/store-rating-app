import StoreForm from "./StoreForm";
import StoreTable from "./StoreTable";

const StoreManagement = ({
  showStoreForm,
  setShowStoreForm,
  formFields,
  inputClass,
  storeData,
  setStoreData,
  handleCreateStore,
  tableColumns,
  thClass,
  sortedStores,
  handleSort,
  renderSortArrow,
  handleDeleteStore,
}) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800">Store Management</h2>

      <button
        onClick={() => setShowStoreForm(!showStoreForm)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
          showStoreForm
            ? "bg-gray-200 text-gray-800"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {showStoreForm ? "Cancel" : "+ Add New Store"}
      </button>
    </div>

    {showStoreForm && (
      <StoreForm
        formFields={formFields}
        inputClass={inputClass}
        storeData={storeData}
        setStoreData={setStoreData}
        handleCreateStore={handleCreateStore}
      />
    )}

    <StoreTable
      tableColumns={tableColumns}
      thClass={thClass}
      sortedStores={sortedStores}
      handleSort={handleSort}
      renderSortArrow={renderSortArrow}
      handleDeleteStore={handleDeleteStore}
    />
  </div>
);

export default StoreManagement;
