import logging
from logging import Logger
import coloredlogs
from src.config.env import settings

_log_level = logging._nameToLevel[settings.APP.LOG_LEVEL.upper()]


def get_logger(name) -> Logger:
    colorlog_format = '%(asctime)s | line: %(lineno)d | %(name)s/%(funcName)s | %(levelname)s: %(message)s'
    logger = logging.getLogger(name)
    coloredlogs.install(fmt=colorlog_format, level=_log_level, logger=logger)
    return logger


log = get_logger(__name__)