import { errorHandler } from "../errors.js"
import { logger } from "../app.js"

export const test = async (req, res) => {
	logger.debug('Hello world')
	logger.http('Hello world')
	logger.info('Hello world')
	logger.warning('Hello world')
	logger.error('Hello world')
	logger.fatal('Hello world')
    
    res.status(200).json({message:'Ok'})
}
