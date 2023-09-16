package adapter

import (
	apimodel "github.com/esceer/todo/backend/internal/api/model"
	dbmodel "github.com/esceer/todo/backend/internal/storage/model"
)

func ApiToDb(apiModel *apimodel.TaskCreate) *dbmodel.Task {
	if apiModel == nil {
		return nil
	}
	return &dbmodel.Task{
		Title:    apiModel.Title,
		Detail:   apiModel.Detail,
		Priority: apiModel.Priority,
		DueAt:    apiModel.DueAt,
	}
}

func DbToApi(dbModel *dbmodel.Task) *apimodel.TaskResponse {
	if dbModel == nil {
		return nil
	}
	return &apimodel.TaskResponse{
		ID:        dbModel.ID,
		Title:     dbModel.Title,
		Detail:    dbModel.Detail,
		Priority:  dbModel.Priority,
		DueAt:     dbModel.DueAt,
		CreatedAt: dbModel.CreatedAt,
	}
}

func DbSliceToApiSlice(dbModels []*dbmodel.Task) []*apimodel.TaskResponse {
	apiModel := make([]*apimodel.TaskResponse, len(dbModels))
	for i, dbm := range dbModels {
		apiModel[i] = DbToApi(dbm)
	}
	return apiModel
}
