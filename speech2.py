
import asyncio
import websockets

from vosk import Model, KaldiRecognizer
import pyaudio
from queue import Queue




model = Model("vosk-model-small-en-us-0.15")
recognizer = KaldiRecognizer(model, 16000)
    


record =  Queue()



async def handler(websocket, path):
    try:
        
        while True:
            ev = await websocket.recv()
            # print(f"Received data: {data}")
            # reply = f"Data recieved as: {data}!"
            # await websocket.send(reply)

            print(ev)

            
            if ev == "start":
                #start
                print("start")
                record.put(True)

                mic = pyaudio.PyAudio()
                stream = mic.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
                stream.start_stream()

    

                
                count = 0

                while not record.empty() or ev == "start":
                    #print(list(record.queue))

                    
                    data = stream.read(4096)
                    
                    
                    
                    
                    
         
                    
                    if recognizer.AcceptWaveform(data):
                        count = count + 1
                        text = recognizer.Result()

                        print("-------------------------------" + str(count))

                        print(text[14:-3])
                        
                        await asyncio.sleep(0)
                        await websocket.send(text[14:-3])

                        # p1 = threading.Thread(target=wrap_async_func, args=(websocket,text[14:-3] )) 
                        # p1.start() 
                        # p1.join()

                        
                      
                        

                    # if ev == "start":  # Clear queue on new "start" command
                    #     record.get()  # Remove previous recording signal

                stream.stop_stream()
                stream.close()
                mic.terminate()
    

            elif ev == "stop":
                #stop
                print("stop")
                if not record.empty():
                    record.get()


    except websockets.ConnectionClosed:
        print("Connection closed by client.")
    except Exception as e:
        print(f"Error handling message: {e}")
        # Optionally attempt to close the connection gracefully here


# def start_recording (websocket):
               
#                 mic = pyaudio.PyAudio()
#                 stream = mic.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
#                 stream.start_stream()

    

#                 print("statrrrsrsrsrsr")

#                 while not record.empty():
#                     print(list(record.queue))


#                     data = stream.read(4096)
         
#                     time.sleep(0.001)
#                     if recognizer.AcceptWaveform(data):
#                         text = recognizer.Result()

#                         print("-------------------------------")

#                         print(text[14:-3])
#                         websocket.send(text[14:-3])
           
           

async def send(websocket,text):
    print("socket" , text)
    await asyncio.sleep(0)
    await websocket.send(text)

def wrap_async_func(websocket,text):
    asyncio.run(send(websocket,text))



start_server = websockets.serve(handler, "localhost", 8000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()