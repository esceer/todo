package adapter

import (
	"time"

	apimodel "github.com/esceer/todo/backend/internal/api/model"
	"github.com/esceer/todo/backend/internal/common"
	dbmodel "github.com/esceer/todo/backend/internal/storage/model"
)

func ApiToDb(apiModel *apimodel.TaskCreate) *dbmodel.Task {
	if apiModel == nil {
		return nil
	}
	dbModel := &dbmodel.Task{
		Title:    apiModel.Title,
		Details:  apiModel.Details,
		Priority: apiModel.Priority,
	}
	if apiModel.DueAt != nil {
		dbModel.DueAt = (*time.Time)(apiModel.DueAt)
	}
	return dbModel
}

func DbToApi(dbModel *dbmodel.Task) *apimodel.TaskResponse {
	if dbModel == nil {
		return nil
	}
	apiModel := &apimodel.TaskResponse{
		ID:        dbModel.ID,
		Title:     dbModel.Title,
		Details:   dbModel.Details,
		Completed: *dbModel.Completed,
		Priority:  dbModel.Priority,
		CreatedAt: *dbModel.CreatedAt,
	}
	if dbModel.DueAt != nil {
		apiModel.DueAt = (*common.DateTimeShort)(dbModel.DueAt)
	}
	return apiModel
}

func DbSliceToApiSlice(dbModels []*dbmodel.Task) []*apimodel.TaskResponse {
	apiModel := make([]*apimodel.TaskResponse, len(dbModels))
	for i, dbm := range dbModels {
		apiModel[i] = DbToApi(dbm)
	}
	return apiModel
}
