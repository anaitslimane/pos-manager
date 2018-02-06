angular.module("PosManager").constant("PosApiResponseStatusCode",
    {
        Init : 0,
        Success : 1,
        ModelStateError : -1,
        CRUDoperationError: -2,
        MediaOperationError: -3
    }
);