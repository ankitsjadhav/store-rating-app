const StoreForm = ({
  formFields,
  inputClass,
  storeData,
  setStoreData,
  handleCreateStore,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 animate-fade-in-down mb-6">
    <h3 className="font-bold text-lg text-green-700 mb-4">
      Register New Store
    </h3>

    <form
      onSubmit={handleCreateStore}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {formFields.map((field) => (
        <input
          key={field.name}
          required={field.name !== "ownerEmail"}
          className={inputClass}
          value={storeData[field.name]}
          onChange={(e) =>
            setStoreData({ ...storeData, [field.name]: e.target.value })
          }
          {...field}
        />
      ))}

      <button className="md:col-span-2 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 mt-2">
        Submit Store
      </button>
    </form>
  </div>
);

export default StoreForm;
