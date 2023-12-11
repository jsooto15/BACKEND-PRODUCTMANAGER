import { logger } from "./app.js"

const errorDict = {
	ValidateError: 422,
	SintaxError: 422,
	PropertyError: 422,
	PermissionError: 403,
	StockError: 500,
	AvailabilityError: 404,
}

export const errorHandler = (err, req, res) => {
    logger.error(err?.message)
	if (err?.name in errorDict) {
		return res.status(errorDict[err.name]).json({ message: err?.message })
	} else {
		return res.status(500).json({ message: err?.message || "Internal server error" })
	}
}

export class ValidateError extends Error{
    constructor(message){
        super(message)
	    this.name = "ValidateError"
    }
}
export class PropertyError extends Error{
    constructor(message){
        super(message)
	    this.name = "PropertyError"
    }
}
export class PermissionError extends Error{
    constructor(message){
        super(message)
	    this.name = "PermissionError"
    }
}
export class StockError extends Error{
    constructor(productName){
        super('No hay stock suficiente del siguiente producto: ' +productName)
        this.name = "StockError"
    }
}
export class AvailabilityError extends Error{
    constructor(message){
        super(message)
	    this.name = "AvailabilityError"
    }
}

