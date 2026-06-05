import time
import logging
import signal

logging.basicConfig(
    format='{"time":"%(asctime)s","level":"%(levelname)s","service":"worker","msg":"%(message)s"}',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

running = True

def handle_signal(sig, frame):
    global running
    logger.info("shutdown signal received")
    running = False

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

def main():
    logger.info("worker started")
    counter = 0
    while running:
        counter += 1
        if counter % 10 == 0:
            logger.info(f"worker heartbeat cycles={counter}")
        time.sleep(1)
    logger.info("worker stopped")

if __name__ == "__main__":
    main()