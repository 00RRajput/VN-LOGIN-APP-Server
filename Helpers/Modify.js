exports.record = (record) => {
    const modifiedData = { ...record, id: record._id };

    delete modifiedData._id;
    delete modifiedData.__v;
    
    return modifiedData;
};