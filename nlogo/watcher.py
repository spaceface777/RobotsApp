#!/usr/bin/python
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from threading import Timer, Event, Thread
import requests
import json


prevContents = ""

t = None
max_skips = 0

import sys

global map
map = None

global batteryLevel
batteryLevel = 100

global robotPos
robotPos = (0, 0)

global detections
detections = []


def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def checkUpdate():
    global prevContents

    prevPrevContents = prevContents

    # if prevContents == "":
        # print("no previous contents")

    with open('GardenRobot.txt', 'r') as file:
        contents = file.read()
        if contents != prevContents:
            # print('\nfile modified')
            diff = contents.replace(prevContents, '')
            prevContents = contents

            while (diff := diff.strip()) != '':
                if diff.startswith("Patch Colors"):
                    # print('setting patch colors')
                    if diff.find("Start of Operation") == -1:
                        # print('start of operation not found')
                        prevContents = prevPrevContents
                        return

                    colors = diff[diff.find("Patch Colors") : diff.find("Start of Operation")].strip()
                    colors = colors.split('\n')
                    # print(colors[0], colors[1], colors[2], colors[-2], colors[-1])
                    colors = colors[1:]

                    # format: x, y, [r g b]
                    colors = [color.split(', ') for color in colors]
                    colors = [[color[0], color[1], [int(c) for c in color[2][1:-1].split()]] for color in colors]

                    min_x = 0
                    min_y = 0
                    max_x = 0
                    max_y = 0

                    for color in colors:
                        x = int(color[0])
                        y = int(color[1])
                        if x < min_x:
                            min_x = x
                        if x > max_x:
                            max_x = x
                        if y < min_y:
                            min_y = y
                        if y > max_y:
                            max_y = y

                    grid = [[0 for i in range(max_x - min_x + 1)] for j in range(max_y - min_y + 1)]

                    for color in colors:
                        x = int(color[0])
                        y = -int(color[1])

                        grid[y - min_y][x - min_x] = color[2]

                    # for row in grid:
                    #     for cell in row:
                    #         r, g, b = cell
                    #         print(f'\x1b[48;2;{r};{g};{b}m', end='  ')
                    #     print('\x1b[0m')

                    global map
                    map = grid

                    diff = diff[diff.find("Start of Operation") + len("Start of Operation"):]
                

                elif diff.startswith("Battery Percentage"):
                    # Battery Percentage: 100%
                    line = diff.split('\n')[0]

                    global batteryLevel
                    batteryLevel = int(line.split(': ')[1][:-1])
                    # print(f'Setting Battery Level: {batteryLevel}')
                    diff = diff[len(line):]


                elif diff.startswith("Robot position"):
                    # Robot position is (-16, 16)
                    line = diff.split('\n')[0]

                    global robotPos
                    robotPos = tuple(int(i) for i in line.split(' is ')[-1][1:-1].split(', '))
                    # print(f'Setting Robot Position: {robotPos}')
                    diff = diff[len(line):]


                elif diff.startswith("Unhealthy plant"):
                    # Unhealthy plant at (-9, 4)
                    line = diff.split('\n')[0]

                    # global detections
                    x, y = tuple(int(i) for i in line.split(' at ')[-1][1:-1].split(', '))
                    detections.append({ 'pos': (x, y), 'isSick': True })

                    diff = diff[len(line):]


                elif diff.startswith("Healthy plant"):
                    # Healthy plant at (-9, 4)
                    line = diff.split('\n')[0]

                    # global detections
                    x, y = tuple(int(i) for i in line.split(' at ')[-1][1:-1].split(', '))
                    detections.append({ 'pos': (x, y), 'isSick': False })

                    diff = diff[len(line):]

                else:
                    print('unrecognized command')
                    # print(diff)
                    break


class MyHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('/GardenRobot.txt'):
            # global t
            # global max_skips
            # if t is not None:
            #     if max_skips > 0:
            #         max_skips -= 1
            #         return
            #     t.cancel()
            # t = Timer(0.2, checkUpdate)
            # t.start()
            # max_skips = 5

            checkUpdate()


def setInterval(func, interval, *args):
    stopped = Event()
    def loop():
        while not stopped.wait(interval): # the first call is in `interval` secs
            func(*args)
    Thread(target=loop).start()    
    return stopped.set



SERVER_URL = 'https://robotsapp.spaceface.dev/'

global lastBatteryLevel
lastBatteryLevel = 100
global lastRobotPos
lastRobotPos = (0, 0)
global lastMap
lastMap = None

def submitUpdates():
    global batteryLevel
    global robotPos
    global map
    global detections

    global lastBatteryLevel
    global lastRobotPos
    global lastMap

    if map != lastMap:
        body = { 'map': map }
        r = requests.post(SERVER_URL + 'setMap', json=body)
        print('Map updated' if r.status_code == 200 else 'Map update failed')

        lastMap = map

    if batteryLevel != lastBatteryLevel or robotPos != lastRobotPos:
        body = { 'battery': batteryLevel, 'pos': robotPos }
        r = requests.post(SERVER_URL + 'setState', json=body)
        print('Robot updated' if r.status_code == 200 else 'Robot update failed')

        lastBatteryLevel = batteryLevel
        lastRobotPos = robotPos
    
    det = detections
    if len(det) > 0:
        body = { 'detections': det }
        r = requests.post(SERVER_URL + 'addDetections', json=body)
        print('Detections updated' if r.status_code == 200 else 'Detections update failed')

        detections = []



if __name__ == "__main__":
    if '--local' in sys.argv:
        SERVER_URL = 'http://localhost:13579/'


    main_dir = os.path.dirname(os.path.realpath(__file__))
    os.chdir(main_dir)

    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()

    setInterval(submitUpdates, 0.2)

    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
