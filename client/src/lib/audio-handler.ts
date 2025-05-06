import hark from 'hark'
import { apiService } from './api-service'

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  isRecording = false
  private stream: MediaStream | null = null
  private speechEvents: any = null
  private silenceTimeout: NodeJS.Timeout | null = null
  private isSpeaking = false

  constructor(
    private onStatusChange: (status: string) => void,
    private onTranscriptionComplete: (text: string) => void,
    private autoStopTimeout: number = 1000, // Auto stop after 1.5 seconds of silence
  ) { }

  async requestMicrophoneAccess(): Promise<MediaStream> {
    if (this.stream) {
      return this.stream
    }

    try {
      console.log('Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('Microphone access granted')
      this.stream = stream
      return stream
    } catch (error) {
      console.error('Error accessing microphone:', error)
      this.onStatusChange('Error: ' + (error as Error).message)
      throw error
    }
  }

  async startRecording() {
    try {
      if (!this.stream) {
        this.stream = await this.requestMicrophoneAccess()
      }

      this.mediaRecorder = new MediaRecorder(this.stream)
      this.audioChunks = []
      this.isRecording = true

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio...')
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
          console.log('Audio blob size:', audioBlob.size, 'bytes')
          await this.sendToWhisper(audioBlob)
        } else {
          console.log('No audio data collected')
          this.onStatusChange('')
        }
      }

      // Initialize speech detection with hark
      this.initSpeechDetection()

      this.mediaRecorder.start(1000) // Collect data every second
      console.log('Started recording')
      this.onStatusChange('Recording... Speak now')
    } catch (error) {
      console.error('Error starting recording:', error)
      this.onStatusChange('Error: ' + (error as Error).message)
    }
  }

  private initSpeechDetection() {
    if (!this.stream) return

    // Create speech events using hark
    this.speechEvents = hark(this.stream, {
      threshold: -50, // Adjust sensitivity (-90 to -30, where -30 is less sensitive)
      interval: 100, // Check speech every 100ms
    })

    this.speechEvents.on('speaking', () => {
      console.log('User started speaking')
      this.isSpeaking = true
      this.onStatusChange('Recording... Speak now')

      // Clear any existing silence timeout
      if (this.silenceTimeout) {
        clearTimeout(this.silenceTimeout)
        this.silenceTimeout = null
      }
    })

    this.speechEvents.on('stopped_speaking', () => {
      console.log('User stopped speaking')
      this.isSpeaking = false

      // Set a timeout to stop recording after silence
      this.silenceTimeout = setTimeout(() => {
        if (!this.isSpeaking && this.isRecording) {
          console.log(
            `${this.autoStopTimeout}ms of silence detected, stopping recording`,
          )
          this.stopRecording()
        }
      }, this.autoStopTimeout)
    })
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      console.log('Stopping recording...')
      this.mediaRecorder.stop()
      this.isRecording = false
      this.onStatusChange('Processing audio...')

      // Clean up speech detection
      if (this.speechEvents) {
        this.speechEvents.stop()
        this.speechEvents = null
      }

      if (this.silenceTimeout) {
        clearTimeout(this.silenceTimeout)
        this.silenceTimeout = null
      }
    }
  }

  releaseResources() {
    console.log('Releasing all audio recorder resources')

    // Stop recording if still active
    if (this.isRecording) {
      try {
        this.stopRecording()
      } catch (error) {
        console.error(
          'Error stopping recording during resource release:',
          error,
        )
      }
    }

    // Stop all tracks in the stream
    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => {
          console.log(
            `Stopping track: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`,
          )
          track.stop()
        })
      } catch (error) {
        console.error('Error stopping media tracks:', error)
      } finally {
        this.stream = null
      }
    }

    // Clean up speech detection
    if (this.speechEvents) {
      try {
        this.speechEvents.stop()
      } catch (error) {
        console.error('Error stopping speech events:', error)
      } finally {
        this.speechEvents = null
      }
    }

    // Clear any pending timeouts
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout)
      this.silenceTimeout = null
    }

    // Reset state
    this.isRecording = false
    this.isSpeaking = false
    this.audioChunks = []
    this.mediaRecorder = null

    console.log('Audio recorder resources released')
  }

  private async sendToWhisper(audioBlob: Blob) {
    try {
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }
      const transcribedText = await apiService.speechToText(audioBlob);
      console.log('Transcribed text:', transcribedText);
      // console.log('Sending audio to Whisper API...')
      // const formData = new FormData()
      // formData.append('file', audioBlob, 'audio.webm')
      // formData.append('model', 'whisper-1')

      // const response = await fetch(
      //   'https://api.openai.com/v1/audio/transcriptions',
      //   {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`,
      //     },
      //     body: formData,
      //   },
      // )

      // if (!response.ok) {
      //   const errorText = await response.text()
      //   throw new Error(
      //     `HTTP error! status: ${response.status}, details: ${errorText}`,
      //   )
      // }

      // const data = await response.json()
      // console.log('Received transcription:', data.text)
      // this.onStatusChange('')
      if(transcribedText) this.onTranscriptionComplete(transcribedText) 
      else {
        this.stopRecording()
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      this.onStatusChange('Error: Failed to transcribe audio')
    }
  }
}
