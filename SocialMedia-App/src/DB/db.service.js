export const create = async ({ model, data = {} } = {}) => {
  const document = await model.create(data);
  return document;
}



export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  query = { page: 1, limit: 5, paginate: true, sort: {} },
} = {}) => {
  let { page = 1, limit = 5, paginate = true, sort } = query;

  let queryDoc = model.find(filter).select(select).populate(populate).sort(sort);
  page = Number(page);
  limit = Number(limit);
  paginate = paginate === "true" || paginate === true;
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 5;

  const skip = limit * (page - 1);

  if (paginate) {
    console.log(paginate);
    queryDoc = queryDoc.skip(skip).limit(limit);
  }

  const documents = await queryDoc.lean().exec();
  const totalDocuments = paginate ? await model.countDocuments(filter) : documents.length
  return {
    data: documents,
    numberOfRecords: totalDocuments,
    numberOfPages: Math.ceil(totalDocuments / limit),
    currentPage: page
  };
};


export const findOne = async ({ model, filter = {}, select = "", populate = [], lean = true } = {}) => {
  const document = await model.findOne(filter).select(select).populate(populate).lean(lean);
  return document;
}

export const findById = async ({ model, id = "", select = "", populate = [] } = {}) => {
  const document = await model.findById(id).select(select).populate(populate);
  return document;
}

export const findByIdAndUpdate = async ({ model, id = "", data = {}, options = {}, select = "", populate = [] } = {}) => {
  const document = await model.findByIdAndUpdate(id, data, options).select(select).populate(populate);
  return document;
}

export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = {}, select = "", populate = [] } = {}) => {
  const document = await model.findOneAndUpdate(filter, data, options).select(select).populate(populate);
  return document;
}

export const updateOne = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
  const document = await model.updateOne(filter, data, options);
  return document;
}

export const updateMany = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
  const document = await model.updateMany(filter, data, options);
  return document;
}

export const findByIdAndDelete = async ({ model, id = "", select = "", populate = [] } = {}) => {
  const document = await model.findByIdAndDelete(id).select(select).populate(populate);
  return document;
}

export const findOneAndDelete = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
  const document = await model.findOneAndDelete(filter).select(select).populate(populate);
  return document;
}

export const deleteOne = async ({ model, filter = {} } = {}) => {
  const document = await model.deleteOne(filter);
  return document;
}

export const deleteMany = async ({ model, filter = {} } = {}) => {
  const document = await model.deleteMany(filter);
  return document;
}