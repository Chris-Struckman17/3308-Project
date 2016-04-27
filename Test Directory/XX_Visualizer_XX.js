import javax.sound.sampled.*;
import java.io.*;
import java.util.Vector;

public class JavaSound{
  
    //A default buffer size.
     
    private static final int BUFFER_SIZE = 16384;
  
    private static final boolean DEBUG = false;
     
    // bites for sound.
     
    private byte[] buffer;
     
    private AudioFileFormat audioFileFormat;
     
    
    // threads playing sound.
    
    private Vector playbacks;
  
    
    private SoundView soundView;
  
    private String fileName;
    
    //Obtains the byte array representation of this sound.
    
    public byte[] getBuffer()
    {
return buffer;
    }
  
  
    // Gets the AudioFileFormat describing this sound.
    
    public AudioFileFormat getAudioFileFormat()
    {
return audioFileFormat;
    }
     
    public byte[] asArray()
    {
return getBuffer();
    }
  
    public Vector getPlaybacks()
    {
return playbacks;
    }
     
    public String getFileName()
    {
return fileName;
    }
 
     
    /**
     * Changes the byte array that represents this sound. 
     */
    public void setBuffer(byte[] newBuffer)
    {
buffer = newBuffer;
    }
         
    /**
     * Changes the AudioFileFormat of this sound.
     */
    public void setAudioFileFormat(AudioFileFormat newAudioFileFormat)
    {
audioFileFormat = newAudioFileFormat;
    }
  
    public void setSoundView(SoundView soundView)
    {
this.soundView = soundView;
    }
     
    public JavaSound()
    {
this(3);
    }
     
    public JavaSound(int numSeconds)
    {
/* 
   Make a new sound with 22.05K sampling, 16 bits, 

int lengthInBytes = 22050 * 1* numSeconds * 2;
 
audioFileFormat = new AudioFileFormat(AudioFileFormat.Type.WAVE, 
      audioFormat, lengthInBytes/(2));
  
buffer = new byte[lengthInBytes];
playbacks = new Vector();
    }
  
 
    public JavaSound(int sampleSizeInBits, boolean isBigEndian)
    {
AudioFormat audioFormat = new AudioFormat(22050, sampleSizeInBits, 2,
  true, isBigEndian);
  
int lengthInBytes = 22050*2*5*(sampleSizeInBits/8);
 
audioFileFormat = new AudioFileFormat(AudioFileFormat.Type.WAVE,
      audioFormat, 
      lengthInBytes/(sampleSizeInBits/8*2));
 
buffer = new byte[lengthInBytes];
playbacks = new Vector();
    }
     
    /**
     * Constructs a new JavaSound from the given file.
     */
    public JavaSound(String fileName) throws JavaSoundException
    { 
loadFromFile(fileName);
playbacks = new Vector();
    }
  
    public AudioInputStream makeAIS()
    {
AudioFileFormat.Type fileType = audioFileFormat.getType();
ByteArrayInputStream bais = new ByteArrayInputStream(buffer);
int frameSize = audioFileFormat.getFormat().getFrameSize();
 
AudioInputStream audioInputStream = 
    new AudioInputStream(bais, audioFileFormat.getFormat(), 
 buffer.length/frameSize);
return audioInputStream;
    }//makeAIS
  
    public void printError(String message) throws JavaSoundException
    {
printError(message, null);
    }
  
    public void printError(String message, Exception e) throws JavaSoundException
    {
if(message != null)
    {
System.err.println(message);
if(e != null)
    {
e.printStackTrace();
    }
    }
    }
  
     
    public boolean isStereo()
    {
if(audioFileFormat.getFormat().getChannels() == 1)
    return false;
else
    return true;
    }
  
  
    public void writeToFile(String outFileName) throws JavaSoundException
    {
  

AudioInputStream audioInputStream = makeAIS();
AudioFileFormat.Type type = audioFileFormat.getType();
 
try
    {
audioInputStream.reset();
    }//try reset audioInputStream
catch(Exception e)
    {
printError("Unable to reset the Audio stream.  Please "+
   "try again.", e);
    }//catch
  
 
//get the file to write to
File file = new File(outFileName);
if(!file.exists())
    {
//if the file doesn't exist, make one
try
    {
file.createNewFile();
    }//try
catch(IOException e)
    {
printError("That file does not already exist, and"+
   "there were problems creating a new file" +
   "of that name.  Are you sure the path" +
   "to: " + outFileName + "exists?", e);
    }//catch
    }//if
 
 
//write to the file
try
    {
if(AudioSystem.write(audioInputStream, type, file) == -1)
    { 
printError("Problems writing to file.  Please " +
   "try again.");
    } 
    }//try
catch(FileNotFoundException e)
    {
printError("The file you specified did not already exist " +
   "so we tried to create a new one, but were unable"+
   "to do so.  Please try again.  If problems persist"+
   "see your TA.", e);
    }
catch(Exception e)
    { 
printError("Problems writing to file: " + outFileName, e);
    }//catch
 
  
//cloe the input stream, we're done writing
try
    {
audioInputStream.close();
    }//try
catch(Exception e)
    {
printError("Unable to close the Audio stream.");
    }//catch
 
    }//writeToFile(String outFileName)
    
  
    public void loadFromFile(String inFileName) throws JavaSoundException
    {
 
if(inFileName == null)
    {
printError("You must pass in a valid file name.  Please try" +
   "again.");
    }
 

File file = new File(inFileName);
if(!file.exists())
    {
printError("The file: " + inFileName + " doesn't exist");
    }
  

AudioInputStream audioInputStream;
try
    {
audioInputStream = AudioSystem.getAudioInputStream(file);
    }
catch(Exception e)
    {
printError("Unable to create Audio Stream from file " + 
   inFileName + ".  The file type is unsupported.  " + 
   "Are you sure you're using a WAV, AU, or" +
   "AIFF file?" , e);
return;
    }//catch
 
 
/*
  Array representing this sound
if((audioInputStream.getFrameLength() * 
    audioInputStream.getFormat().getFrameSize()) > Integer.MAX_VALUE)
    {
printError("The sound in file: " + inFileName + " is too long."+
   "  Try using a shorter sound.");
    }
int bufferSize = (int)audioInputStream.getFrameLength() *
    audioInputStream.getFormat().getFrameSize();
 
buffer = new byte[bufferSize];
 
int numBytesRead = 0;
int offset = 0;
 
//read all the bytes into the buffer
while(true)
    {
try
    {
numBytesRead = 
    audioInputStream.read(buffer, offset, bufferSize);
if(numBytesRead == -1)//no more data
    break;
else
    offset += numBytesRead;
    }//try
catch(Exception e)
    {
printError("Problems reading the input stream.  "+
   "You might want to try again using this "+
   " file: " + inFileName + "or a different"+ 
   " file.  If problems persist, ask your TA."
   , e);
    }//catch
    }//while
 
 

if(inFileName.toLowerCase().endsWith(".wav"))
    {
audioFileFormat = 
    new AudioFileFormat(AudioFileFormat.Type.WAVE,
audioInputStream.getFormat(),
(int)audioInputStream.getFrameLength());
    }
else if(inFileName.toLowerCase().endsWith(".au"))
    {
audioFileFormat = 
    new AudioFileFormat(AudioFileFormat.Type.AU,
audioInputStream.getFormat(),
(int)audioInputStream.getFrameLength());
    }
else if (inFileName.toLowerCase().endsWith(".aif")||
 inFileName.toLowerCase().endsWith(".aiff"))
    {
audioFileFormat = 
    new AudioFileFormat(AudioFileFormat.Type.AIFF,
audioInputStream.getFormat(),
(int)audioInputStream.getFrameLength());
    }
else
    {
printError("Unsupported file type.  Please try again with a "+
   "file that ends in .wav, .au, .aif, or .aiff");
    }
 
if(DEBUG)
    {
System.out.println("New sound created from file: " + fileName);
System.out.println("\tendianness: " + audioInputStream.getFormat().isBigEndian());
System.out.println("\tencoding: " + audioInputStream.getFormat().getEncoding());
    }
 
this.fileName = file.getName();
  
    }//loadFromFile(String inFileName)
     
   
   
Playback playback = new Playback();
playbacks.add(playback);
playback.start();
    }
     
    
    public void blockingPlay()
    {

Playback playback = new Playback();
playbacks.add(playback);
playback.start();
while(playback.isAlive()){;}//wait until the sound is done playing
    }
     
  
    
    public void playAtRateDur(double rate, double durInFrames) 
throws JavaSoundException
    {
if(durInFrames > getLengthInFrames())
    {
printError("The given duration in frames, " + durInFrames + 
   " is out of the playable range.  Try something " +
   "between 1 and " + getLengthInFrames());
    }
if(rate > Float.MAX_VALUE)
    {
printError("The new sample rate, " + rate + "is out of the " +
   "playable range.  Try something between " +
   "0 and " + Float.MAX_VALUE);
    }
playAtRateInRange((float)rate, 0, (int)durInFrames-1, false);
    }
  
    
    public void blockingPlayAtRateDur(double rate, double durInFrames)
throws JavaSoundException
    {
if(durInFrames > getLengthInFrames())
    {
printError("The given duration in frames, " + durInFrames + 
   " is out of the playable range.  Try something " +
   "between 1 and " + getLengthInFrames());
    }
if(rate > Float.MAX_VALUE)
    {
printError("The new sample rate, " + rate + "is out of the " +
   "playable range.  Try something between " +
   "0 and " + Float.MAX_VALUE);
    }
  
playAtRateInRange((float)rate, 0, (int)durInFrames-1, true);
 
    }
  
    
    public void playAtRateInRange(float rate, int startFrame, int endFrame)
throws JavaSoundException
    {
playAtRateInRange(rate, startFrame, endFrame, false);
    }
     
    
    public void blockingPlayAtRateInRange(float rate, int startFrame, 
  int endFrame)
throws JavaSoundException
    {
playAtRateInRange(rate, startFrame, endFrame, true);
    }
     
    
    public void playAtRateInRange(float rate, int startFrame, int endFrame, 
  boolean isBlocking)
throws JavaSoundException
    {
  

if(endFrame >= getAudioFileFormat().getFrameLength())
    {
printError("You are trying to play to index: " + (endFrame+1) +
   ".  The sound only has " + 
   getAudioFileFormat().getFrameLength() +
   " samples total.");
    }
if(startFrame < 0)
    {
printError("You cannot start playing at index " + 
   (startFrame+1) + 
   ".  Choose 1 to start at the begining.");
    }
if(endFrame < startFrame)
    {
printError("You cannot start playing at index " + 
   (startFrame+1) + " and stop playing at index " + 
   (endFrame+1) + ".  The start index must be before" +
   "the stop index.");
    }
 
 
       
byte[] oldBuffer = getBuffer();
AudioFileFormat oldAFF = getAudioFileFormat();
 

int frameSize = getAudioFileFormat().getFormat().getFrameSize();
int durInFrames = (endFrame - startFrame) + 1;
if(DEBUG)
    System.out.println("\tnew durInFrames = " + durInFrames);
 

int newBufferSize = durInFrames * frameSize;
         
byte[] newBuffer = new byte[newBufferSize];
for(int i = 0; i <  newBufferSize; i++)
    {
newBuffer[i] = oldBuffer[(startFrame*frameSize) + i];
    }
  

AudioFormat newAF = 
    new AudioFormat(oldAFF.getFormat().getEncoding(),
    oldAFF.getFormat().getSampleRate() * rate,
    oldAFF.getFormat().getSampleSizeInBits(),
    oldAFF.getFormat().getChannels(),
    oldAFF.getFormat().getFrameSize(),
    oldAFF.getFormat().getFrameRate() * rate,
    oldAFF.getFormat().isBigEndian());
  

AudioFileFormat newAFF = 
    new AudioFileFormat(oldAFF.getType(), newAF, durInFrames);
 
  
/*
  change the values in this Sound
*/
setBuffer(newBuffer);
setAudioFileFormat(newAFF);
if(DEBUG)
    {
System.out.println("playAtRateInRange(" + rate + ", " + 
   startFrame + ", " + endFrame + ", " +
   isBlocking + ")");
System.out.println("\t(length of sound = " + 
   getAudioFileFormat().getFrameLength() + ")");
    }
 
/*
  play the modified sound
*/
Playback playback = new Playback();
playbacks.add(playback);
playback.start();
 
if(isBlocking)
    while(playback.isAlive()){;}//wait until the thread exits
  

while(!playback.getPlaying()){;}
 
setBuffer(oldBuffer);//restore the buffer
setAudioFileFormat(oldAFF);//restore the file format
    }
     
    
    private void removePlayback(Playback playbackToRemove)
    {
if(playbacks.contains(playbackToRemove))
    {
playbacks.remove(playbackToRemove);
playbackToRemove = null;
    }
    }
  
    public class Playback extends Thread
    {
SourceDataLine line;
boolean playing = false;
  
private void shutDown(String message, Exception e) 
{
    if (message != null)
{
    System.err.println(message);
    e.printStackTrace();
}
    playing = false;
}
 

public void stopPlaying()
{
    playing = false;
}
 
public boolean getPlaying()
{
    return playing;
}
  

public void run()
{
     
    //get something to play
    AudioInputStream audioInputStream = makeAIS();
    if(audioInputStream == null)
{
    shutDown("There is no input stream to play", null);
    return;
}
     
    //reset stream to the begining
    try
{
    audioInputStream.reset();
}
    catch(Exception e)
{
    shutDown("Problems resetting the stream\n", e);
    return;
}
     
    
    DataLine.Info info = new DataLine.Info(SourceDataLine.class, 
   audioFileFormat.getFormat());
    if(!AudioSystem.isLineSupported(info))
{
    shutDown("Line matching " + info + "not supported.", null);
    return;
}
     
    
{
    line = (SourceDataLine) AudioSystem.getLine(info);
    if(soundView != null)
line.addLineListener(soundView);
    line.open(audioFileFormat.getFormat(), BUFFER_SIZE);
}
    catch(LineUnavailableException e)
{
    shutDown("Unable to open the line: ", e);
    return;
}
     
    //play back the captured data
    int frameSizeInBytes = audioFileFormat.getFormat().getFrameSize();
    int bufferLengthInBytes = line.getBufferSize();
    int bufferLengthInFrames = bufferLengthInBytes / frameSizeInBytes;
    byte[] data = new byte[bufferLengthInBytes];
    int numBytesRead = 0;
     
    //start the source data line and begin playing
    line.start();
    playing = true;
  
    
    while(playing)
{
    try
{
    if((numBytesRead = audioInputStream.read(data)) 
       == -1)
{
    break;//end of audioInputStream
}
    int numBytesRemaining = numBytesRead;
    while(numBytesRemaining > 0)
{
    numBytesRemaining -= 
line.write(data, 0, numBytesRemaining);
}//while
}//try
    catch(Exception e)
{
    shutDown("Error during playback: ", e);
    break;
}//catch
}//while
     
    
    if(playing)
line.drain();
   
    line.stop();
    line.close();
    line = null;
    shutDown(null, null);
    if(DEBUG)
System.out.println("exiting run method");
    
    removePlayback(this);
 
}//run()
 
    }//end class Playback
     
   
     
    
    public byte[] getFrame(int frameNum) throws JavaSoundException
    {
if(frameNum >= getAudioFileFormat().getFrameLength())
    {
printError("That index "+ (frameNum+1) +", does not exist. "+ 
   "There are only "+ 
   getAudioFileFormat().getFrameLength() + 
   " frames in the entire sound");
    }
 
int frameSize = getAudioFileFormat().getFormat().getFrameSize();
byte[] theFrame = new byte[frameSize];
for (int i = 0; i < frameSize; i++)
    {
theFrame[i] = getBuffer()[frameNum*frameSize+i];
    }
return theFrame;
    }
  
    
    /**
     * Obtains the length of the audio data contained in the file, expressed
     */
    public int getLengthInFrames()
    {
return getAudioFileFormat().getFrameLength();
    }
     
    public int getSample(int frameNum) throws JavaSoundException
    {
//Before we get started, lets make sure that frame exists
if(frameNum >= getAudioFileFormat().getFrameLength())
    {
printError("You are trying to access the sample at index: "
   + (frameNum+1) + ", but there are only " + 
   getAudioFileFormat().getFrameLength() +
   " samples in the file!");
    }
if(frameNum < 0)
    {
printError("You asked for the sample at index: " + (frameNum+1) +
   ".  This number is less than one.  Please try" +
   "again using an index in the range [1," + 
   getAudioFileFormat().getFrameLength()+"]");
    }
       
 
AudioFormat format = getAudioFileFormat().getFormat();
int sampleSizeInBits = format.getSampleSizeInBits();
boolean isBigEndian = format.isBigEndian();
  
byte[] theFrame = getFrame(frameNum);
  
if(format.getEncoding().equals(AudioFormat.Encoding.PCM_SIGNED))
    {

if(sampleSizeInBits == 8)//8 bits == 1 byte
    return theFrame[0];
else if(sampleSizeInBits == 16)
    return bytesToInt16(theFrame, 0, isBigEndian);
else if(sampleSizeInBits == 24)
    return bytesToInt24(theFrame, 0, isBigEndian);
else if(sampleSizeInBits == 32)
    return bytesToInt32(theFrame, 0, isBigEndian);
else
    {
printError("Unsupported audio encoding.  The sample "+
   "size is not recognized as a standard "+ 
   "format.");
return -1;
    }
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.PCM_UNSIGNED))
    {
if(sampleSizeInBits == 8)
    return unsignedByteToInt(theFrame[0])-
(int)Math.pow(2,7);
else if(sampleSizeInBits == 16)
    return unsignedByteToInt16(theFrame, 0, isBigEndian)-
(int)Math.pow(2, 15);
else if(sampleSizeInBits == 24)
    return unsignedByteToInt24(theFrame, 0, isBigEndian)-
(int)Math.pow(2, 23);
else if(sampleSizeInBits == 32)
    return unsignedByteToInt32(theFrame, 0, isBigEndian)-
(int)Math.pow(2, 31);
else
    {
printError("Unsupported audio encoding.  The sample "+
   "size is not recognized as a standard "+
   "format.");
return -1;
    }
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ALAW))
    {
return alaw2linear(buffer[0]);
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ULAW))
    {
return ulaw2linear(buffer[0]);
    }
else
    {
printError("unsupported audio encoding: " + 
   format.getEncoding() + ".  Currently only PCM, " +
   "ALAW and ULAW are supported.  Please try again" +
   "with a different file.");
return -1;
    }
    }
  
    
    public int getLeftSample(int frameNum) throws JavaSoundException
    {
//default is to getLeftSample
 
return getSample(frameNum);
 
  
    }
     
    
    public int getRightSample(int frameNum) throws JavaSoundException
    {
//Before we get started, lets make sure that frame exists
if(frameNum >= getAudioFileFormat().getFrameLength())
    {
printError("You are trying to access the sample at index: "
   + (frameNum+1) + ", but there are only " + 
   getAudioFileFormat().getFrameLength() +
   " samples in the file!");
    }
if(frameNum < 0)
    {
printError("You asked for the sample at index: "+(frameNum+1) +
   ".  This number is less than one.  Please try" +
   " again using an index in the range [1," + 
   getAudioFileFormat().getFrameLength()+"].");
    }
  
AudioFormat format = getAudioFileFormat().getFormat();
int channels;
if((channels = format.getChannels())==1)
    {
printError("Only stereo sounds have different right and left" +
   " samples.  You are using a mono sound, try " +
   "getSample("+(frameNum+1)+") instead");
return -1;
    }
int sampleSizeInBits = format.getSampleSizeInBits();
boolean isBigEndian = format.isBigEndian();
  
byte[] theFrame = getFrame(frameNum);
  
if(format.getEncoding().equals(AudioFormat.Encoding.PCM_SIGNED))
    {
if(sampleSizeInBits == 8)//8 bits == 1 byte
    return theFrame[1];
else if(sampleSizeInBits == 16)
    return bytesToInt16(theFrame, 2, isBigEndian);
else if(sampleSizeInBits == 24)
    return bytesToInt24(theFrame, 3, isBigEndian);
else if(sampleSizeInBits == 32)
    return bytesToInt32(theFrame, 4, isBigEndian);
else
    {
printError("Unsupported audio encoding.  The sample"+
   " size is not recognized as a standard"+
   " format.");
return -1;
    }
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.PCM_UNSIGNED))
    {
if(sampleSizeInBits == 8)
    return unsignedByteToInt(theFrame[1]);
else if(sampleSizeInBits == 16)
    return unsignedByteToInt16(theFrame, 2, isBigEndian);
else if(sampleSizeInBits == 24)
    return unsignedByteToInt24(theFrame, 3, isBigEndian);
else if(sampleSizeInBits == 32)
    return unsignedByteToInt32(theFrame, 4, isBigEndian);
else
    {
printError("Unsupported audio encoding.  The sample"+
   " size is not recognized as a standard" +
   " format.");
return -1;
    }  
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ALAW))
    {
return alaw2linear(buffer[1]);
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ULAW))
    {
return ulaw2linear(buffer[1]);
    }
else
    {
printError("unsupported audio encoding: " + 
   format.getEncoding() + ".  Currently only PCM, " +
   "ALAW and ULAW are supported.  Please try again" +
   "with a different file.");
return -1;
    }
    }
 
     
     
   
    public int getLength()
    {
return buffer.length;
    }
     
    dioSystem#NOT_SPECIFIED
     */
    public int getChannels()
    {
return getAudioFileFormat().getFormat().getChannels();
    }
     
  
    public void setFrame(int frameNum, byte[] theFrame) throws JavaSoundException
    {
if(frameNum > getAudioFileFormat().getFrameLength())
    {
printError("That frame, number "+frameNum+", does not exist. "+
   "There are only " + 
   getAudioFileFormat().getFrameLength()+
   " frames in the entire sound");
    }
int frameSize = getAudioFileFormat().getFormat().getFrameSize();
if(frameSize != theFrame.length)
    printError("Frame size doesn't match, line 383.  This should" +
       " never happen.  Please report the problem to a TA.");
for(int i = 0; i < frameSize; i++)
    {
buffer[frameNum*frameSize+i] = theFrame[i];
    }
    }
  
    public void setSample(int frameNum, int sample) throws JavaSoundException
    {
AudioFormat format = getAudioFileFormat().getFormat();
int sampleSizeInBits = format.getSampleSizeInBits();
boolean isBigEndian = format.isBigEndian();
 
byte[] theFrame = getFrame(frameNum);
  
if(format.getEncoding().equals(AudioFormat.Encoding.PCM_SIGNED))
    {
if(sampleSizeInBits == 8)//8 bits = 1 byte = first cell in array
    {
theFrame[0] = (byte)sample;
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 16)//2 bytes, first 2 cells in array
    {
intToBytes16(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 24)
    {
intToBytes24(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 32)
    {
intToBytes32(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
else
    {
printError("Unsupported audio encoding.  The sample"+
   "size is not recognized as a standard format");
    }
    }//if format == PCM_SIGNED
else if(format.getEncoding().equals(AudioFormat.Encoding.PCM_UNSIGNED))
    {
if(sampleSizeInBits == 8)
    {
theFrame[0] = intToUnsignedByte(sample);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 16)
    {
intToUnsignedBytes16(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 24)
    {
intToUnsignedBytes24(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 32)
    {
intToUnsignedBytes32(sample, theFrame, 0, isBigEndian);
setFrame(frameNum, theFrame);
    }
  
else
    {
printError("Unsupported audio encoding.  The sample"+
   " size is not recognized as a standard "+
   "format.");
    }
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ALAW))
    {
if((sample>Short.MAX_VALUE)||(sample<Short.MIN_VALUE))
    printError("You are trying to set the sample value to: "+
       sample + ", but the maximum value for a sample"+
       " in this format is: "+Short.MAX_VALUE+
       ", and the minimum value is: "+Short.MIN_VALUE+
       ".  Please choose a value in that range.");
theFrame[0] = linear2alaw((short)sample);
setFrame(frameNum, theFrame);
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ULAW))
    {
 
if((sample>Short.MAX_VALUE)||(sample<Short.MIN_VALUE))
    printError("You are trying to set the sample value to: "+
       sample + ", but the maximum value for a sample"+
       " in this format is: "+Short.MAX_VALUE+
       ", and the minimum value is: "+Short.MIN_VALUE+
       ".  Please choose a value in that range.");
theFrame[0] = linear2ulaw((short)sample);
setFrame(frameNum, theFrame);
    }
else
    {
printError("unsupported audio encoding: " + 
   format.getEncoding() + ".  Currently only PCM, " +
   "ALAW and ULAW are supported.  Please try again" +
   "with a different file.");
    }
    }//setSample(int, int)
     
    public void setLeftSample(int frameNum, int sample) throws JavaSoundException
    {
setSample(frameNum, sample);
    }
  
    public void setRightSample(int frameNum, int sample) 
throws JavaSoundException
    {
AudioFormat format = getAudioFileFormat().getFormat();
int sampleSizeInBits = format.getSampleSizeInBits();
boolean isBigEndian = format.isBigEndian();
  
if(format.getChannels() == 1)
    printError("this is a mono sound.  only stereo sounds have" +
       " different left and right samples.");
  
byte[] theFrame = getFrame(frameNum);
 
if(format.getEncoding().equals(AudioFormat.Encoding.PCM_SIGNED))
    {
if(sampleSizeInBits == 8)
    {
theFrame[1] = (byte)sample;
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 16)
    {
intToBytes16(sample, theFrame, 2, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 24)
    {
intToBytes24(sample, theFrame, 3, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 32)
    {
intToBytes32(sample, theFrame, 4, isBigEndian);
setFrame(frameNum, theFrame);
    }
else
    {
printError("Unsupported audio encoding.  The sample"+
   "size is not recognized as a standard format");
    }
    }//if format == PCM_SIGNED
else if(format.getEncoding().equals(AudioFormat.Encoding.PCM_UNSIGNED))
    {
if(sampleSizeInBits == 8)
    {
theFrame[1] = intToUnsignedByte(sample);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 16)
    {
intToUnsignedBytes16(sample, theFrame, 2, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 24)
    {
intToUnsignedBytes24(sample, theFrame, 3, isBigEndian);
setFrame(frameNum, theFrame);
    }
else if(sampleSizeInBits == 32)
    {
intToUnsignedBytes32(sample, theFrame, 4, isBigEndian);
setFrame(frameNum, theFrame);
    }
else
    {
printError("Unsupported audio encoding.  The sample"+
   " size is not recognized as a standard"+
   " format");
    }
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ALAW))
    {
if((sample>Short.MAX_VALUE)||(sample<Short.MIN_VALUE))
    printError("You are trying to set the sample value to: "+
       sample + ", but the maximum value for a sample"+
       " in this format is: "+Short.MAX_VALUE+
       ", and the minimum value is: "+Short.MIN_VALUE+
       ".  Please choose a value in that range.");
theFrame[1] = linear2alaw((short)sample);
setFrame(frameNum, theFrame);
    }
else if(format.getEncoding().equals(AudioFormat.Encoding.ULAW))
    {
if((sample>Short.MAX_VALUE)||(sample<Short.MIN_VALUE))
    printError("You are trying to set the sample value to: "+
       sample + ", but the maximum value for a sample"+
       " in this format is: "+Short.MAX_VALUE+
       ", and the minimum value is: "+Short.MIN_VALUE+
       ".  Please choose a value in that range.");
theFrame[1] = linear2ulaw((short)sample);
setFrame(frameNum, theFrame);
    }
else
    {
printError("unsupported audio encoding: " + 
   format.getEncoding() + ".  Currently only PCM, " +
   "ALAW and ULAW are supported.  Please try again" +
   "with a different file.");
    }
    }
    
    private static int bytesToInt16( byte [] buffer, int byteOffset, 
    boolean bigEndian) 
    { 
return bigEndian?
    ((buffer[byteOffset]<<8) | (buffer[byteOffset+1] & 0xFF)):
      
    ((buffer[byteOffset+1]<<8) | (buffer[byteOffset] & 0xFF));
    } 
     
    private static int bytesToInt24( byte [] buffer, int byteOffset, 
    boolean bigEndian) 
    { 
return bigEndian?
    ((buffer[byteOffset]<<16) // let Java handle sign-bit 
     | ((buffer[byteOffset+1] & 0xFF)<<8) // inhibit sign-bit handling 
     | ((buffer[byteOffset+2] & 0xFF))):
     
    ((buffer[byteOffset+2]<<16) // let Java handle sign-bit 
     | ((buffer[byteOffset+1] & 0xFF)<<8) // inhibit sign-bit handling 
     | (buffer[byteOffset] & 0xFF));
    } 
     
    private static int bytesToInt32( byte [] buffer, int byteOffset, 
    boolean bigEndian) 
    { 
return bigEndian?
    ((buffer[byteOffset]<<24) // let Java handle sign-bit 
     | ((buffer[byteOffset+1] & 0xFF)<<16) // inhibit sign-bit handling 
     | ((buffer[byteOffset+2] & 0xFF)<<8) // inhibit sign-bit handling 
     | (buffer[byteOffset+3] & 0xFF)):
     
    ((buffer[byteOffset+3]<<24) // let Java handle sign-bit 
     | ((buffer[byteOffset+2] & 0xFF)<<16) // inhibit sign-bit handling 
     | ((buffer[byteOffset+1] & 0xFF)<<8) // inhibit sign-bit handling 
     | (buffer[byteOffset] & 0xFF));
    } 
    
  
    private static final boolean ZEROTRAP=true;
    private static final short BIAS=0x84;
    private static final int CLIP=32635;
    private static final int exp_lut1[] ={
0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
    7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
    };
     
  
    private static short [] u2l = {
-32124, -31100, -30076, -29052, -28028, -27004, -25980, -24956,
-23932, -22908, -21884, -20860, -19836, -18812, -17788, -16764,
-15996, -15484, -14972, -14460, -13948, -13436, -12924, -12412,
-11900, -11388, -10876, -10364, -9852, -9340, -8828, -8316,
-7932, -7676, -7420, -7164, -6908, -6652, -6396, -6140,
-5884, -5628, -5372, -5116, -4860, -4604, -4348, -4092,
-3900, -3772, -3644, -3516, -3388, -3260, -3132, -3004,
-2876, -2748, -2620, -2492, -2364, -2236, -2108, -1980,
-1884, -1820, -1756, -1692, -1628, -1564, -1500, -1436,
-1372, -1308, -1244, -1180, -1116, -1052, -988, -924,
-876, -844, -812, -780, -748, -716, -684, -652,
-620, -588, -556, -524, -492, -460, -428, -396,
-372, -356, -340, -324, -308, -292, -276, -260,
-244, -228, -212, -196, -180, -164, -148, -132,
-120, -112, -104, -96, -88, -80, -72, -64,
-56, -48, -40, -32, -24, -16, -8, 0,
32124, 31100, 30076, 29052, 28028, 27004, 25980, 24956,
23932, 22908, 21884, 20860, 19836, 18812, 17788, 16764,
15996, 15484, 14972, 14460, 13948, 13436, 12924, 12412,
11900, 11388, 10876, 10364, 9852, 9340, 8828, 8316,
7932, 7676, 7420, 7164, 6908, 6652, 6396, 6140,
5884, 5628, 5372, 5116, 4860, 4604, 4348, 4092,
3900, 3772, 3644, 3516, 3388, 3260, 3132, 3004,
2876, 2748, 2620, 2492, 2364, 2236, 2108, 1980,
1884, 1820, 1756, 1692, 1628, 1564, 1500, 1436,
1372, 1308, 1244, 1180, 1116, 1052, 988, 924,
876, 844, 812, 780, 748, 716, 684, 652,
620, 588, 556, 524, 492, 460, 428, 396,
372, 356, 340, 324, 308, 292, 276, 260,
244, 228, 212, 196, 180, 164, 148, 132,
120, 112, 104, 96, 88, 80, 72, 64,
56, 48, 40, 32, 24, 16, 8, 0
    }; 
    private static short ulaw2linear( byte ulawbyte) 
    { 
return u2l[ulawbyte & 0xFF];
    } 
  
    public static byte linear2ulaw(int sample) {
int sign, exponent, mantissa, ulawbyte;
 
if (sample>32767) sample=32767;
else if (sample<-32768) sample=-32768;
/* Get the sample into sign-magnitude. */
sign = (sample >> 8) & 0x80;    /* set aside the sign */
if (sign != 0) sample = -sample;    /* get magnitude */
if (sample > CLIP) sample = CLIP;    /* clip the magnitude */
 

sample = sample + BIAS;
exponent = exp_lut1[(sample >> 7) & 0xFF];
mantissa = (sample >> (exponent + 3)) & 0x0F;
ulawbyte = ~(sign | (exponent << 4) | mantissa);
if (ZEROTRAP)
    if (ulawbyte == 0) ulawbyte = 0x02;  /* optional CCITT trap */
return((byte) ulawbyte);
    }
     
     
    
    private static final byte QUANT_MASK = 0xf;/* Quantization field mask. */
    private static final byte SEG_SHIFT = 4;  /* Left shift for segment number. */
    private static final short[] seg_end = {
0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF, 0x1FFF, 0x3FFF, 0x7FFF
    };
  
     
    
    private static short [] a2l = {
-5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736,
-7552, -7296, -8064, -7808, -6528, -6272, -7040, -6784,
-2752, -2624, -3008, -2880, -2240, -2112, -2496, -2368,
-3776, -3648, -4032, -3904, -3264, -3136, -3520, -3392,
-22016, -20992, -24064, -23040, -17920, -16896, -19968, -18944,
-30208, -29184, -32256, -31232, -26112, -25088, -28160, -27136,
-11008, -10496, -12032, -11520, -8960, -8448, -9984, -9472,
-15104, -14592, -16128, -15616, -13056, -12544, -14080, -13568,
-344, -328, -376, -360, -280, -264, -312, -296,
-472, -456, -504, -488, -408, -392, -440, -424,
-88, -72, -120, -104, -24, -8, -56, -40,
-216, -200, -248, -232, -152, -136, -184, -168,
-1376, -1312, -1504, -1440, -1120, -1056, -1248, -1184,
-1888, -1824, -2016, -1952, -1632, -1568, -1760, -1696,
-688, -656, -752, -720, -560, -528, -624, -592,
-944, -912, -1008, -976, -816, -784, -880, -848,
5504, 5248, 6016, 5760, 4480, 4224, 4992, 4736,
7552, 7296, 8064, 7808, 6528, 6272, 7040, 6784,
2752, 2624, 3008, 2880, 2240, 2112, 2496, 2368,
3776, 3648, 4032, 3904, 3264, 3136, 3520, 3392,
22016, 20992, 24064, 23040, 17920, 16896, 19968, 18944,
30208, 29184, 32256, 31232, 26112, 25088, 28160, 27136,
11008, 10496, 12032, 11520, 8960, 8448, 9984, 9472,
15104, 14592, 16128, 15616, 13056, 12544, 14080, 13568,
344, 328, 376, 360, 280, 264, 312, 296,
472, 456, 504, 488, 408, 392, 440, 424,
88, 72, 120, 104, 24, 8, 56, 40,
216, 200, 248, 232, 152, 136, 184, 168,
1376, 1312, 1504, 1440, 1120, 1056, 1248, 1184,
1888, 1824, 2016, 1952, 1632, 1568, 1760, 1696,
688, 656, 752, 720, 560, 528, 624, 592,
944, 912, 1008, 976, 816, 784, 880, 848
    }; 
     
    private static short alaw2linear( byte ulawbyte) 
    { 
return a2l[ulawbyte & 0xFF];
    } 
     
    public static byte linear2alaw(short pcm_val)
    
    {
bytemask;
byteseg=8;
byteaval;
 
if (pcm_val >= 0) {
    mask = (byte) 0xD5;/* sign (7th) bit = 1 */
} else {
    mask = 0x55;/* sign bit = 0 */
    pcm_val = (short) (-pcm_val - 8);
}
 
/* Convert the scaled magnitude to segment number. */
for (int i = 0; i < 8; i++) {
    if (pcm_val <= seg_end[i]) {
seg=(byte) i;
break;
    }
}
 
/* Combine the sign, segment, and quantization bits. */
if (seg >= 8)/* out of range, return maximum value. */
    return (byte) ((0x7F ^ mask) & 0xFF);
else {
    aval = (byte) (seg << SEG_SHIFT);
    if (seg < 2)
aval |= (pcm_val >> 4) & QUANT_MASK;
    else
aval |= (pcm_val >> (seg + 3)) & QUANT_MASK;
    return (byte) ((aval ^ mask) & 0xFF);
}
    }
     
    
  
     
    
    private static void intToBytes16( int sample, byte [] buffer, int byteOffset, 
     boolean bigEndian) 
    { 
if (bigEndian) 
    {
buffer[byteOffset++]=( byte ) (sample >> 8);
buffer[byteOffset]=( byte ) (sample & 0xFF);
    } 
else
    {
buffer[byteOffset++]=( byte ) (sample & 0xFF);
buffer[byteOffset]=( byte ) (sample >> 8);
    }
    } 
     
   
    private static void intToBytes24( int sample, byte [] buffer, 
      int byteOffset, boolean bigEndian) 
    { 
if (bigEndian) 
    {
buffer[byteOffset++]=( byte ) (sample >> 16);
buffer[byteOffset++]=( byte ) ((sample >>> 8) & 0xFF);
buffer[byteOffset]=( byte ) (sample & 0xFF);
    } 
else
    {
buffer[byteOffset++]=( byte ) (sample & 0xFF);
buffer[byteOffset++]=( byte ) ((sample >>> 8) & 0xFF);
buffer[byteOffset]=( byte ) (sample >> 16);
    }
    } 
     
    private static void intToBytes32( int sample, byte [] buffer, 
      int byteOffset, boolean bigEndian) 
    { 
if (bigEndian) 
    {
buffer[byteOffset++]=( byte ) (sample >> 24);
buffer[byteOffset++]=( byte ) ((sample >>> 16) & 0xFF);
buffer[byteOffset++]=( byte ) ((sample >>> 8) & 0xFF);
buffer[byteOffset]=( byte ) (sample & 0xFF);
    } 
else
    {
buffer[byteOffset++]=( byte ) (sample & 0xFF);
buffer[byteOffset++]=( byte ) ((sample >>> 8) & 0xFF);
buffer[byteOffset++]=( byte ) ((sample >>> 16) & 0xFF);
buffer[byteOffset]=( byte ) (sample >> 24);
    }
    } 
    
     private static int unsignedByteToInt(byte b) 
    {

return ((int) b & 0xFF);
    }
  
    private static int unsignedByteToInt16(byte[] buffer, int offset, 
  boolean isBigEndian)
    {
 
if(isBigEndian)
    {
return ( (unsignedByteToInt(buffer[offset]) << 8) |
 unsignedByteToInt(buffer[offset+1]) );
    }
else
    {
return( (unsignedByteToInt(buffer[offset+1]) << 8) |
unsignedByteToInt(buffer[offset]));
    }
 
    }
  
    public static int unsignedByteToInt24(byte[] buffer, int offset,
  boolean isBigEndian)
    {
if(isBigEndian)
    {
return ( (unsignedByteToInt(buffer[offset]) << 16) |
 (unsignedByteToInt(buffer[offset+1]) << 8) |
 unsignedByteToInt(buffer[offset+2]));
    }
else
    {
return ( (unsignedByteToInt(buffer[offset+2]) << 16) |
 (unsignedByteToInt(buffer[offset+1]) << 8) |
 unsignedByteToInt(buffer[offset]));
    }
    }
  
    public static int unsignedByteToInt32(byte[] buffer, int offset,
  boolean isBigEndian)
    {
if(isBigEndian)
    {
return( (unsignedByteToInt(buffer[offset]) << 24) |
(unsignedByteToInt(buffer[offset+1]) << 16) |
(unsignedByteToInt(buffer[offset+2]) << 8) |
unsignedByteToInt(buffer[offset+3]) );
    }
else
    {
return((unsignedByteToInt(buffer[offset+3]) << 24) |
(unsignedByteToInt(buffer[offset+2]) << 16) |
(unsignedByteToInt(buffer[offset+1]) << 8) |
unsignedByteToInt(buffer[offset]) );
    }
    }
 
    public static byte intToUnsignedByte(int sample)
    {

return((byte)(sample ^ -128));
    }
  
 
  
    public static void intToUnsignedBytes16(int sample, byte [] buffer, 
      int byteOffset, boolean bigEndian) 
    {
  
if(bigEndian)
    {
buffer[byteOffset] = (byte)(sample >>> 8 ^ -128);
buffer[byteOffset+1] = (byte)(sample & 0xff);
    }
else
    {
buffer[byteOffset+1] = (byte)(sample >>> 8 ^ -128);
buffer[byteOffset] = (byte)(sample & 0xff);
    }
    }
  
    public static void intToUnsignedBytes24(int sample, byte [] buffer, 
      int byteOffset, boolean bigEndian)
    {
if(bigEndian)
    {
buffer[byteOffset] = (byte)(sample >>> 16 ^ -128);
buffer[byteOffset+1] = (byte)(sample >>> 8);
buffer[byteOffset +2] = (byte)(sample & 0xff);
    }
else
    {
buffer[byteOffset+2] = (byte)(sample >>> 16 ^ -128);
buffer[byteOffset+1] = (byte)(sample >>> 8);
buffer[byteOffset] = (byte)(sample & 0xff);
    }
    }
  
    public static void intToUnsignedBytes32(int sample, byte [] buffer, 
      int byteOffset, boolean bigEndian)
    {
if(bigEndian)
    {
buffer[byteOffset] = (byte)(sample >>> 24 ^ -128);
buffer[byteOffset+1] = (byte)(sample >>> 16);
buffer[byteOffset+2] = (byte)(sample >>> 8);
buffer[byteOffset+3] = (byte)(sample & 0xff);
    }
else
    {
buffer[byteOffset+3] = (byte)(sample >>> 24 ^ -128);
buffer[byteOffset+2] = (byte)(sample >>> 16);
buffer[byteOffset+1] = (byte)(sample >>> 8);
buffer[byteOffset] = (byte)(sample & 0xff);
    }
    }
     /*
    *a String representation of this JavaSound.
     */
    public String toString()
    {
return getAudioFileFormat().getFormat().toString();
    }
     
     
    public String justATaste()
    {
return "Sorry, justATaste is not implemented at this time.";
    }
     
    public String justABufferTaste(byte[] b)
    {
return "Sorry, justABufferTaste is not implemented at this time.";
    }
     
    public static void main(String args[])
    {
 
try{
     
     
    
     

  
 OldJavaSound oldSound = new OldJavaSound();
 oldSound.loadFromFile("/Users/ellie/Desktop/ellie/JavaSoundDemo/audio/1-welcome.wav");
 System.out.println("old file format: " + oldSound.audioFormat);
  
 System.out.println("\nnew file frame 0: " + mysound2.getFrame(0));
 System.out.println("\tnew file sample 0: " + mysound2.getSample(0));
 System.out.println("old file frame 1: " + oldSound.getFrame(1));
 System.out.println("\told file sample 1: " + oldSound.getSample(1));
  
 System.out.println("\new file frame 1: " + mysound2.getFrame(1));
 System.out.println("\tnew file sample 1: " + mysound2.getSample(1));
 System.out.println("old file frame 2: " + oldSound.getFrame(2));
 System.out.println("\told file sample 2: " + oldSound.getSample(2));
  
 System.out.println("\nnew file frame 2: " + mysound2.getFrame(2));
 System.out.println("\tnew file sample 2: "+mysound2.getSample(2));
 System.out.println("old file frame 3: " + oldSound.getFrame(3));
 System.out.println("\told file sample 3: "+oldSound.getSample(3));
  

  System.out.println("\nnew file set sample 2: 14");
  mysound2.setSample(2, 14);
  System.out.println("\tchecking value: " + mysound2.getSample(2));

 System.out.println("\nblocking play:  stereo");
 mysound1.blockingPlay();
     
ing playAtRateDur
 
 System.out.println("\nblocking - double the rate");
 mysound1.blockingPlayAtRateDur
 (2, mysound1.getAudioFileFormat().getFrameLength());
  
 System.out.println("\nblocking - back to the original sound");
 mysound1.blockingPlay();
  
 System.out.println("\nblocking - half the duration");
 mysound1.blockingPlayAtRateDur
 (1, mysound1.getAudioFileFormat().getFrameLength()/2);
  
 System.out.println("\nnon-blocking - back to original sound");
 mysound1.play();
  
 System.out.println("\nblocking - half the rate");
 mysound1.blockingPlayAtRateDur
 (.5, mysound1.getAudioFileFormat().getFrameLength());
  
 System.out.println("\nblocking - only the middle ");
 mysound1.blockingPlayAtRateInRange(1, 35811, 71623);
 really long sound ~2.5 minutes
 
 System.out.println("\ncreating a new sound:  big yellow taxi");
 JavaSound longSound = 
 new JavaSound("/Users/ellie/Desktop/ellie/Big Yellow Taxi.wav");
  
 System.out.println("\n blocking - long wav");
 longSound.blockingPlay();

     
  
    JavaSound windowsSound = 
new JavaSound("/Users/ellie/Desktop/sound2.wav");
  
    System.out.println("getSample(28567): " + 
       windowsSound.getSample(28567));
  
    windowsSound.setSample(28567, -32);
  
    System.out.println("is it the same?" + 
       windowsSound.getSample(28567));
 
  

    JavaSound ws3 =
new JavaSound("/Users/ellie/Desktop/audio/startup.wav");
    System.out.println(ws3.getAudioFileFormat().getFormat());
  
    JavaSound ws4 =
new JavaSound("/Users/ellie/Desktop/audio/ETUDE_16.WAV");
    System.out.println(ws4.getAudioFileFormat().getFormat());
  
     
    JavaSound ws7 =
new JavaSound("/Users/ellie/Desktop/audio2/pcm_11.025_16_mono.wav");
    System.out.println(ws7.getAudioFileFormat().getFormat());
  
    JavaSound ws8 =
new JavaSound("/Users/ellie/Desktop/audio2/pcm_11.025_16_stereo.wav");
    System.out.println(ws8.getAudioFileFormat().getFormat());
  
     
    JavaSound ws5 =
new JavaSound("/Users/ellie/Desktop/audio2/pcm_11.025_8_mono.wav");
    System.out.println(ws5.getAudioFileFormat().getFormat());
  
    //6 is really 8kHz contrary to the filename i typed incorrectly
    JavaSound ws6 =
new JavaSound("/Users/ellie/Desktop/audio2/pcm_11.025_8_stereo.wav");
    System.out.println(ws6.getAudioFileFormat().getFormat());
  
    
  
    System.out.println("");
    System.out.println(ws5.getSample(0));
    ws5.setSample(0,ws5.getSample(0));
    System.out.println(ws5.getSample(0));
     
    System.out.println("");
    System.out.println(ws5.getSample(1));
    ws5.setSample(1,ws5.getSample(1));
    System.out.println(ws5.getSample(1));
     
    System.out.println("");
    System.out.println(ws6.getSample(0));
    ws6.setSample(0, ws6.getSample(0));
    System.out.println(ws6.getSample(0));
  
    
     
  
    JavaSound big8 = new JavaSound(8, true);
    JavaSound big16 = new JavaSound(16, true);
    JavaSound big24 = new JavaSound(24, true);
    JavaSound big32 = new JavaSound(32, true);
  
    JavaSound little8 = new JavaSound(8, false);
    JavaSound little16 = new JavaSound(16, false);
    JavaSound little24 = new JavaSound(24, false);
    JavaSound little32 = new JavaSound(32, false);
  
    System.out.println("LEFT\n\tbig8(0): " + big8.getLeftSample(0) +
       "\n\tbig16(0): " + big16.getLeftSample(0) +
       "\n\tbig24(0): " + big24.getLeftSample(0) +
       "\n\tbig32(0): " + big32.getLeftSample(0) +
       "\n\tlittle8(0): " + little8.getLeftSample(0) +
       "\n\tlittle16(0): " + little16.getLeftSample(0) +
       "\n\tlittle24(0): " + little24.getLeftSample(0) +
       "\n\tlittle32(0): " + little32.getLeftSample(0));
     
     System.out.println("RIGHT\n\tbig8(0): " + big8.getRightSample(0) +
       "\n\tbig16(0): " + big16.getRightSample(0) +
       "\n\tbig24(0): " + big24.getRightSample(0) +
       "\n\tbig32(0): " + big32.getRightSample(0) +
       "\n\tlittle8(0): " + little8.getRightSample(0) +
       "\n\tlittle16(0): " + little16.getRightSample(0) +
       "\n\tlittle24(0): " + little24.getRightSample(0) +
       "\n\tlittle32(0): " + little32.getRightSample(0));
  
     big8.setLeftSample(0,0);
     big16.setLeftSample(0,0);
     big24.setLeftSample(0,0);
     big32.setLeftSample(0,0);
  
     little8.setLeftSample(0,0);
     little16.setLeftSample(0,0);
     little24.setLeftSample(0,0);
     little32.setLeftSample(0,0);
  
     big8.setRightSample(0,0);
     big16.setRightSample(0,0);
     big24.setRightSample(0,0);
     big32.setRightSample(0,0);
  
     little8.setRightSample(0,0);
     little16.setRightSample(0,0);
     little24.setRightSample(0,0);
     little32.setRightSample(0,0);
  
     System.out.println("LEFT\n\tbig8(0): " + big8.getLeftSample(0) +
       "\n\tbig16(0): " + big16.getLeftSample(0) +
       "\n\tbig24(0): " + big24.getLeftSample(0) +
       "\n\tbig32(0): " + big32.getLeftSample(0) +
       "\n\tlittle8(0): " + little8.getLeftSample(0) +
       "\n\tlittle16(0): " + little16.getLeftSample(0) +
       "\n\tlittle24(0): " + little24.getLeftSample(0) +
       "\n\tlittle32(0): " + little32.getLeftSample(0));
     
     System.out.println("RIGHT\n\tbig8(0): " + big8.getRightSample(0) +
       "\n\tbig16(0): " + big16.getRightSample(0) +
       "\n\tbig24(0): " + big24.getRightSample(0) +
       "\n\tbig32(0): " + big32.getRightSample(0) +
       "\n\tlittle8(0): " + little8.getRightSample(0) +
       "\n\tlittle16(0): " + little16.getRightSample(0) +
       "\n\tlittle24(0): " + little24.getRightSample(0) +
       "\n\tlittle32(0): " + little32.getRightSample(0));
  
     //setting bounds
     big8.setLeftSample(0,0-(int)Math.pow(2,7));
     big16.setLeftSample(0,0-(int)Math.pow(2,15));
     big24.setLeftSample(0,0-(int)Math.pow(2,23));
     big32.setLeftSample(0, 0-(int)Math.pow(2,31));
  
     little8.setLeftSample(0,0-(int)Math.pow(2,7));
     little16.setLeftSample(0,0-(int)Math.pow(2,15));
     little24.setLeftSample(0,0-(int)Math.pow(2, 23));
     little32.setLeftSample(0,0-(int)Math.pow(2, 31));
  
     big8.setRightSample(0,(int)Math.pow(2,7)-1);
     big16.setRightSample(0,(int)Math.pow(2,15)-1);
     big24.setRightSample(0,(int)Math.pow(2,23)-1);
     big32.setRightSample(0,(int)Math.pow(2,31)-1);
  
     little8.setRightSample(0,(int)Math.pow(2,7)-1);
     little16.setRightSample(0,(int)Math.pow(2,15)-1);
     little24.setRightSample(0,(int)Math.pow(2,23)-1);
     little32.setRightSample(0,(int)Math.pow(2,31)-1);
  
     System.out.println("Set left to -2^x, right to 2^x-1");
  
     System.out.println("LEFT\n\tbig8(0): " + big8.getLeftSample(0) +
       "\n\tbig16(0): " + big16.getLeftSample(0) +
       "\n\tbig24(0): " + big24.getLeftSample(0) +
       "\n\tbig32(0): " + big32.getLeftSample(0) +
       "\n\tlittle8(0): " + little8.getLeftSample(0) +
       "\n\tlittle16(0): " + little16.getLeftSample(0) +
       "\n\tlittle24(0): " + little24.getLeftSample(0) +
       "\n\tlittle32(0): " + little32.getLeftSample(0));
     
     System.out.println("RIGHT\n\tbig8(0): " + big8.getRightSample(0) +
       "\n\tbig16(0): " + big16.getRightSample(0) +
       "\n\tbig24(0): " + big24.getRightSample(0) +
       "\n\tbig32(0): " + big32.getRightSample(0) +
       "\n\tlittle8(0): " + little8.getRightSample(0) +
       "\n\tlittle16(0): " + little16.getRightSample(0) +
       "\n\tlittle24(0): " + little24.getRightSample(0) +
       "\n\tlittle32(0): " + little32.getRightSample(0));
    */
  
    System.out.println("\nexiting main");
}
catch(Exception e)
    {
System.out.println(e.getMessage());
    }
System.exit(0);
 
    }//main
     
}//end class JavaSound 




public class JavaSoundException extends Exception
    {
public JavaSoundException(String message)
{
    super(message);
}
    } 


import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.Vector;
import javax.sound.sampled.*;
import java.lang.Math;
import java.awt.geom.*;
  
public class SoundView implements MouseMotionListener, ActionListener, 
  MouseListener, LineListener
{
    private boolean DEBUG = false;
  
    //main parts of the gui
    private JFrame soundFrame;
    private JPanel playPanel;
    private JScrollPane scrollSound;
    private JPanel soundPanel;
     
    //general information
    
    private JavaSound sound;
     
    private boolean inStereo;
     
    //parts of the play panel
    private JLabel startIndex;
    private JLabel stopIndex;
    private JPanel buttonPanel;
    private JButton playEntire;
    private JButton playSelection;
    private JButton playBefore;
    private JButton playAfter;
    private JButton stop;
     
    
     
  
    //parts of the sound panel
    private JPanel leftSoundPanel;
    private JPanel rightSoundPanel;
    private JPanel leftSampleWrapper;
    private JPanel rightSampleWrapper;
    private SamplingPanel leftSamplePanel;
    private SamplingPanel rightSamplePanel;
   
    //parts of the information panel
    private JPanel infoPanel;
    private JLabel indexLabel;
    private JPanel sampleLabelPanel;
    private JLabel leftSampleLabel;
    private JLabel rightSampleLabel;
    private JPanel zoomButtonPanel;
    private JButton zoomButton;
     
    //info related to the sound panel
    private int zoomOutWidth;
    private int zoomInWidth;
    private int sampleWidth;
    private int sampleHeight;
    private int labelHeight;
    private int soundPanelHeight;
    private float framesPerPixel;
    private int cushion;
    private int currentPosition;  
     
     
    //info related to event handling
    private int mousePressed;
    private int mouseReleased;
    private int mousePressedX;
    private int mouseReleasedX;
    private boolean mouseDragged;
    private int startFrame;
    private int stopFrame;
    private int selectionStart;
    private int selectionStop;
     
  
    ///CONSTANTS///
    private static final String currentIndexText = "Current Index: ";
    private static final String startIndexText = "Start At Index: ";
    private static final String stopIndexText = "Stop At Index: ";
    private static final Color selectionColor = Color.gray;
    private static final Color backgroundColor = Color.black;
    private static final Color waveColor = Color.white;
    private static final Color barColor = Color.cyan;
  
    //SEMI-CONSTANTS
    private String leftSampleText = "Sample Value: ";
    private String rightSampleText = "Right (Bottom) Sample Value: ";
  
    //set up variables
    public SoundView(JavaSound sound, boolean inStereo)
    {
this.sound = sound;
this.inStereo = inStereo;
 
if(inStereo)
    leftSampleText = "Left (Top) Sample Value: ";
  

mouseDragged = false;
selectionStart = -1;
selectionStop = -1;
 
//size of the sampling panel
zoomOutWidth = 640;
zoomInWidth = sound.getLengthInFrames();
sampleWidth = zoomOutWidth;
sampleHeight = 201; 
labelHeight = 50;
 

cushion = 10;
 
currentPosition = 0;
  
 
  
//display everything
createWindow();
    }
  
    private void catchException(Exception ex)
    {
System.err.println(ex.getMessage());
    }
     
    public void setTitle(String s)
    {
soundFrame.setTitle(s);
    }
  
    private void createWindow()
    {
String fileName = sound.getFileName();
if(fileName==null)
    fileName = "no file name";
  
soundFrame = new JFrame(fileName);
  
if(inStereo)
    {
soundFrame.
    setSize(new Dimension
    (zoomOutWidth+cushion, 
     2*(sampleHeight+cushion)+labelHeight+100));
    }
else
    {
soundFrame.
    setSize(new Dimension
    (zoomOutWidth+cushion, 
     sampleHeight+cushion+labelHeight+100));
    }
 
soundFrame.getContentPane().setLayout(new BorderLayout());
soundFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

  

createPlayPanel();
soundFrame.getContentPane().add(playPanel, BorderLayout.NORTH);
 

createSoundPanel();
 
//creates the scrollpane for the sound
scrollSound = new JScrollPane();
scrollSound.setViewportView(soundPanel);
soundFrame.getContentPane().add(scrollSound, BorderLayout.CENTER);
scrollSound.setVerticalScrollBarPolicy
    (JScrollPane.VERTICAL_SCROLLBAR_NEVER);
  
//creates the info panel - this displays the current index
//and sample values
createInfoPanel();
  
soundFrame.getContentPane().add(infoPanel, BorderLayout.SOUTH);
  
soundFrame.setResizable(false);
 
soundFrame.setVisible(true);
  
 
    }//createWindow()
     
    private JButton makeButton(String name, boolean enabled, JPanel panel)
    {
JButton j = new JButton(name);
j.addActionListener(this);
j.setEnabled(enabled);
panel.add(j);
return j;
    }
    
    private void createPlayPanel()
    {
playPanel = new JPanel();
 
playPanel.setPreferredSize(new Dimension(zoomOutWidth, 60));
 
playPanel.setLayout(new BorderLayout());
 
startIndex = new JLabel(startIndexText + "N/A");
stopIndex = new JLabel(stopIndexText + "N/A");
 
buttonPanel = new JPanel();
 
playEntire = makeButton("Play Entire Sound", true, buttonPanel);
playSelection = makeButton("Play Selection", false, buttonPanel);
selectionPrevState = false;
playBefore = makeButton("Play Before", false, buttonPanel);
playAfter = makeButton("Play After", true, buttonPanel);
stop = makeButton("Stop", false, buttonPanel);
  
playPanel.add(buttonPanel, BorderLayout.NORTH);
playPanel.add(startIndex, BorderLayout.WEST);
playPanel.add(stopIndex, BorderLayout.EAST);
  
    }//createPlayPanel()
     
    private void createSoundPanel()
    {
//the main panel, we'll add everything to this at the end
soundPanel = new JPanel();
if(inStereo)
    soundPanel.setLayout(new GridLayout(2,1));
else
    soundPanel.setLayout(new GridLayout(1,1));
  

leftSoundPanel = new JPanel();
leftSoundPanel.setLayout(new BorderLayout());
leftSoundPanel.setPreferredSize
    (new Dimension(sampleWidth, sampleHeight+cushion));
 

leftSampleWrapper = new JPanel();//so its centered
leftSamplePanel = new SamplingPanel(true);
leftSamplePanel.addMouseMotionListener(this);
leftSamplePanel.addMouseListener(this);
leftSampleWrapper.add(leftSamplePanel);
leftSampleWrapper.
    setPreferredSize(new Dimension(sampleWidth, sampleHeight+cushion));
 

leftSoundPanel.add(leftSampleWrapper, BorderLayout.NORTH);
  
soundPanel.add(leftSoundPanel);
  
soundPanelHeight = sampleHeight+cushion;
 
if(inStereo)
    {
rightSoundPanel = new JPanel();
rightSoundPanel.setLayout(new BorderLayout());
rightSoundPanel.setPreferredSize
    (new Dimension(sampleWidth, sampleHeight+cushion));
 
rightSampleWrapper = new JPanel();
rightSamplePanel = new SamplingPanel(false);
rightSamplePanel.addMouseMotionListener(this);
rightSamplePanel.addMouseListener(this);
rightSampleWrapper.add(rightSamplePanel);
rightSampleWrapper.setPreferredSize
    (new Dimension(sampleWidth, sampleHeight+cushion));
  
 
rightSoundPanel.add(rightSampleWrapper, BorderLayout.NORTH);
 
soundPanel.add(rightSoundPanel);
 
soundPanelHeight = 2*(sampleHeight+cushion);
    }
 
soundPanel.setPreferredSize(new Dimension(zoomOutWidth,soundPanelHeight));
soundPanel.setSize(soundPanel.getPreferredSize());
    }
     
    public void createInfoPanel()
    {
infoPanel = new JPanel();
sampleLabelPanel = new JPanel();
 
indexLabel = new JLabel(currentIndexText + "1");
 
try
    {
leftSampleLabel = 
    new JLabel(leftSampleText + sound.getLeftSample(0));
if(inStereo)
    rightSampleLabel = 
new JLabel(rightSampleText + sound.getRightSample(0));
    }
catch(Exception ex)
    {
catchException(ex);
    }
 
zoomButtonPanel = new JPanel();
zoomButton = makeButton("Zoom In", true, zoomButtonPanel);
  
 
if(inStereo)
    {
sampleLabelPanel = new JPanel();
sampleLabelPanel.setLayout(new GridLayout(2,1));
sampleLabelPanel.add(leftSampleLabel);
sampleLabelPanel.add(rightSampleLabel);
 
infoPanel.setLayout(new GridLayout(1,4));
infoPanel.add(indexLabel);
infoPanel.add(zoomButtonPanel);
infoPanel.add(sampleLabelPanel);
    }
else
    {
infoPanel.setLayout(new GridLayout(1,3));
infoPanel.add(indexLabel);
infoPanel.add(zoomButtonPanel);
infoPanel.add(leftSampleLabel);
    }
    }
     
    public void mouseClicked(MouseEvent e)
    {
currentPosition = e.getX();
  
if(currentPosition==0)
    {
playBefore.setEnabled(false);
playAfter.setEnabled(true);
    }
else if(currentPosition < sampleWidth)
    {
playBefore.setEnabled(true);
playAfter.setEnabled(true);
    }
else if(currentPosition == sampleWidth)
    {
playBefore.setEnabled(true);
playAfter.setEnabled(false);
    }
  
int curFrame = (int)(currentPosition * framesPerPixel);
  
if(DEBUG)
    System.out.println("mouse click:  " + currentPosition);
  
indexLabel.setText(currentIndexText + curFrame);
try
    {
leftSampleLabel.setText(leftSampleText + 
sound.getLeftSample(curFrame));
    }
catch(Exception ex)
    {
catchException(ex);
    }
 
if(inStereo)
    {
indexLabel.setText(currentIndexText + curFrame);
try
    {
rightSampleLabel.setText(rightSampleText + 
    sound.getRightSample(curFrame));
    }
catch(Exception ex)
    {
catchException(ex);
    }
    }
soundPanel.repaint();
    }
  
//highlight the selection as we drag by pretending
//that we're releasing the mouse at each point
mouseReleased(e);
    }
     
    public void mouseMoved(MouseEvent e)
    {}
         
    public void update(LineEvent e)
    {
if(e.getType().equals(LineEvent.Type.OPEN))
    {
playEntire.setEnabled(false);
playBefore.setEnabled(false);
playAfter.setEnabled(false);
selectionPrevState = playSelection.isEnabled();
playSelection.setEnabled(false);
stop.setEnabled(true);
    }
if(e.getType().equals(LineEvent.Type.CLOSE))
    {
playEntire.setEnabled(true);
playSelection.setEnabled(selectionPrevState);
stop.setEnabled(false);
if(currentPosition==0)
    {
playBefore.setEnabled(false);
playAfter.setEnabled(true);
    }
else if(currentPosition < sampleWidth)
    {
playBefore.setEnabled(true);
playAfter.setEnabled(true);
    }
else if(currentPosition == sampleWidth)
    {
playBefore.setEnabled(true);
playAfter.setEnabled(false);
    }
    }
 
    }
     
  
    public void actionPerformed(ActionEvent e)
    {
if(e.getActionCommand() == "Play Entire Sound")
    {
try
    {
sound.play();
    }
catch(Exception ex)
    {
catchException(ex);
    }
    }
else if(e.getActionCommand() == "Play Selection")
    {
try
    {
sound.playAtRateInRange(1, startFrame, stopFrame);
    }
catch(Exception ex)
    {
catchException(ex);
    }
    }
else if(e.getActionCommand().equals("Stop"))
    {
//stop all playback threads related to this sound
for(int i = 0; i < sound.getPlaybacks().size(); i++)
    {
((JavaSound.Playback)sound.getPlaybacks().elementAt(i))
    .stopPlaying();
    }
    }
else if(e.getActionCommand().equals("Zoom In"))
    {
zoomButton.setText("Zoom Out");
 
currentPosition = (int)(currentPosition*framesPerPixel);
selectionStart = (int)(selectionStart*framesPerPixel);
selectionStop = (int)(selectionStop*framesPerPixel);
  
if(DEBUG)
    System.out.println("Zoom In:  currentPosition = " +
       currentPosition);
 
  
sampleWidth = zoomInWidth;
  
soundPanel.setPreferredSize(new Dimension(zoomInWidth,
      soundPanel.getHeight()));
soundPanel.setSize(soundPanel.getPreferredSize());
  
leftSoundPanel.setPreferredSize(new Dimension(zoomInWidth, 
leftSoundPanel.getHeight()));
leftSoundPanel.setSize(leftSoundPanel.getPreferredSize());
 
leftSampleWrapper.setPreferredSize(new Dimension(zoomInWidth,
leftSampleWrapper.getHeight()));
leftSampleWrapper.setSize(leftSampleWrapper.getPreferredSize());
leftSamplePanel.setPreferredSize(new Dimension(sampleWidth,
       sampleHeight));
leftSamplePanel.setSize(leftSamplePanel.getPreferredSize());
 
leftSamplePanel.createWaveForm(true);
 
if(inStereo)
    {
rightSoundPanel.setPreferredSize
    (new Dimension(zoomInWidth, 
   rightSoundPanel.getHeight()));
rightSoundPanel.setSize
    (rightSoundPanel.getPreferredSize());
  
rightSampleWrapper.setPreferredSize
    (new Dimension(zoomInWidth,
   rightSampleWrapper.getHeight()));
rightSampleWrapper.setSize
    (rightSampleWrapper.getPreferredSize());
  
rightSamplePanel.setPreferredSize
    (new Dimension(zoomInWidth,
   rightSamplePanel.getHeight()));
rightSamplePanel.setSize
    (rightSamplePanel.getPreferredSize());
  
rightSamplePanel.createWaveForm(false);
    }
if(DEBUG)
{
    System.out.println("ZOOM IN SIZES:");
    System.out.println("\tleftSamplePanel: " + 
       leftSamplePanel.getSize());
    System.out.println("\t\tpreferred: " + 
       leftSamplePanel.getPreferredSize());
     
    System.out.println("\tleftSampleWrapper: " + 
       leftSampleWrapper.getSize());
    System.out.println("\t\tpreferred: " + 
       leftSampleWrapper.getPreferredSize());
     
    System.out.println("\tleftSoundPanel: " +
       leftSoundPanel.getSize());
    System.out.println("\t\tpreferred: " + 
       leftSoundPanel.getPreferredSize());
     
    System.out.println("\tsoundPanel: " + 
       soundPanel.getSize());
    System.out.println("\t\tpreferred: " + 
       soundPanel.getPreferredSize());
}
    }
else if (e.getActionCommand().equals("Zoom Out"))
    {
zoomButton.setText("Zoom In");
  
sampleWidth = zoomOutWidth;
  
int divisor = (sound.getLengthInFrames()/sampleWidth);
currentPosition = (int)(currentPosition/divisor);
selectionStart = (int)(selectionStart/divisor);
selectionStop = (int)(selectionStop/divisor);
  
if(DEBUG)
    System.out.println("Zoom Out:  currentPosition = " +
       currentPosition);
  
soundPanel.setPreferredSize
    (new Dimension(zoomOutWidth, 
   soundPanel.getHeight()));
soundPanel.setSize(soundPanel.getPreferredSize());
 
leftSoundPanel.setPreferredSize
    (new Dimension(zoomOutWidth, 
   leftSoundPanel.getHeight()));
leftSoundPanel.setSize(leftSoundPanel.getPreferredSize());
 
leftSampleWrapper.setPreferredSize
    (new Dimension(zoomOutWidth, 
   leftSampleWrapper.getHeight()));
leftSampleWrapper.setSize
    (leftSampleWrapper.getPreferredSize());
 
leftSamplePanel.setPreferredSize
    (new Dimension(sampleWidth, sampleHeight));
leftSamplePanel.setSize(leftSamplePanel.getPreferredSize());
 
leftSamplePanel.createWaveForm(true);
 
if(inStereo)
    {
rightSoundPanel.
    setPreferredSize
    (new Dimension(zoomOutWidth, 
   rightSoundPanel.getHeight()));
rightSoundPanel.setSize
    (rightSoundPanel.getPreferredSize());
  
rightSampleWrapper.setPreferredSize
    (new Dimension(zoomOutWidth,
   rightSampleWrapper.getHeight()));
rightSampleWrapper.setSize
    (rightSampleWrapper.getPreferredSize());
 
rightSamplePanel.setPreferredSize
    (new Dimension(sampleWidth, sampleHeight));
rightSamplePanel.setSize
    (rightSamplePanel.getPreferredSize());
  
rightSamplePanel.createWaveForm(false);
    }
 
soundPanel.repaint();
    }
else if(e.getActionCommand().equals("Play Before"))
    {
try
    {
sound.playAtRateInRange
    (1, 0, (int)(currentPosition * framesPerPixel));
    }
catch(Exception ex)
    {
catchException(ex);
    }
    }
else if(e.getActionCommand().equals("Play After"))
    {
try
    {
sound.playAtRateInRange
    (1, (int)(currentPosition*framesPerPixel), 
     sound.getLengthInFrames()-1);
    }
catch(Exception ex)
    {
catchException(ex);
    }
    }
else
    {
System.err.println("command not defined: " + 
   e.getActionCommand());
    }
 
    }
     
    public class SamplingPanel extends JPanel
    {
 
private boolean forLeftSample;
private Vector points;
 
public SamplingPanel(boolean inputForLeftSample)
{
    forLeftSample = inputForLeftSample;
        
    if(DEBUG)
    System.out.println("creating new sampling panel: " + 
    "\n\tfor left sample: "+forLeftSample +
    "\n\tsampleWidth: " + sampleWidth +
    "\n\tsampleHeight: " + sampleHeight);
     
    setBackground(backgroundColor);
    setPreferredSize(new Dimension(sampleWidth, sampleHeight));
    setSize(getPreferredSize());
    if(DEBUG)
    System.out.println("\tSample panel preferred size: " + 
    getPreferredSize() + "\n\tSample panel size: " + getSize());
     
    points = new Vector();
    createWaveForm(forLeftSample);
}//constructor(forLeftSample)
 
public void createWaveForm(boolean forLeftSample)
{
  
    //get the max y value for a sound of this sample size
    AudioFormat format = sound.getAudioFileFormat().getFormat();
    float maxValue;
   
    if(format.getSampleSizeInBits() == 8)
{
    maxValue = (float)Math.pow(2,7);
}
    else if(format.getSampleSizeInBits() == 16)
{
    maxValue = (float)Math.pow(2, 15);
}
    else if(format.getSampleSizeInBits() == 24)
{
    maxValue = (float)Math.pow(2, 23);
}
    else if(format.getSampleSizeInBits() == 32)
{
    maxValue = (float)Math.pow(2, 31);
}
    else
{
    try
{
    sound.printError("InvalidSampleSize");
}
    catch(Exception ex)
{
    catchException(ex);
}
    return;
}
   
    points.clear();
    framesPerPixel = sound.getLengthInFrames() / sampleWidth;
    for(int pixel = 0; pixel<sampleWidth; pixel++)
{
    float y;
    float sampleValue;
    
     
    if(forLeftSample)
{
    try
{
    sampleValue = sound.
getLeftSample((int)(pixel*framesPerPixel));
}
    catch(Exception ex)
{
    catchException(ex);
    return;
}
}
    else
{
    try
{
    sampleValue = sound.
getRightSample((int)(pixel*framesPerPixel));
}
    catch(Exception ex)
{
    catchException(ex);
    return;
}
}
     
    y = ((float)Math.floor(sampleHeight/2) - 
 (sampleValue  * ((float)Math.floor(sampleHeight/2) / 
  maxValue)));
     
    points.add(new Point2D.Float(pixel, y));
}//for - collecting points
     
     if(DEBUG)
System.out.println("number of points: " + points.size());
repaint();
         
}//createWaveForm()
 
public void paint(Graphics g)
{
    Rectangle rectToPaint = g.getClipBounds();
     
    if(DEBUG)
{
System.out.println("Repainting: " + rectToPaint);
System.out.println("\tSampleWidth: " + sampleWidth);
System.out.println("\tframesPerPixel: " + framesPerPixel);
System.out.println("\tSample panel size: " + getSize());
System.out.println("\tSamplePanel Width: " + getWidth());
System.out.println("\tSamplePanel Height: " + getHeight());
}
  
    //clear out the image
    Graphics2D g2 = (Graphics2D)g;
    g2.setBackground(backgroundColor);
    g2.clearRect((int)rectToPaint.getX(), (int)rectToPaint.getY(), 
 (int)rectToPaint.getWidth(), (int)rectToPaint.getHeight());
    
    
    if(selectionStart!=-1 && selectionStop!=-1)
{
    g2.setBackground(selectionColor);
    g2.clearRect(selectionStart, 0, 
 selectionStop-selectionStart+1, sampleHeight);
}
  
    //draw the lines
    g2.setColor(waveColor);
    for(int i = (int)rectToPaint.getX(); 
i < (rectToPaint.getX() + rectToPaint.getWidth() -1); i++)
{
    g2.draw(new
    Line2D.Float((Point2D.Float)points.elementAt(i),
 (Point2D.Float)points.elementAt(i+1)));
}
  
    //draw the center line
    g2.setColor(barColor);
    g2.setStroke(new BasicStroke(1));
    g2.draw(new Line2D.Double(rectToPaint.getX(), 
      Math.floor(sampleHeight/2), 
      rectToPaint.getX()+rectToPaint.getWidth()-1,
      Math.floor(sampleHeight/2)));
     
    //draw the current position
    if (rectToPaint.getX()<currentPosition && 
currentPosition<(rectToPaint.getX()+rectToPaint.getWidth()-1))
{
    g2.setColor(barColor);
    g2.setStroke(new BasicStroke(1));
    g2.draw(new Line2D.Double(currentPosition, 0, 
      currentPosition, sampleHeight));  
}
}/
  
    }
     
    public static void main(String args[])
    {
try{
  
     
    JavaSound shaggz2 =  new JavaSound("C:\\sound.wav");
    for(int i = 0; i < shaggz2.getLengthInFrames(); i++)
{
    shaggz2.setSample(i, shaggz2.getSample(i));
}
    SoundView shaggzView2 = new SoundView(shaggz2, false);
  
    
}
catch(Exception ex)
    {
System.out.println(ex.getMessage());
    }
 
    }
}
