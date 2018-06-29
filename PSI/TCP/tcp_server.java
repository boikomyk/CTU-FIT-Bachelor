import java.net.*;
import java.io.*;

import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.Charset;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.SocketTimeoutException;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;


// 1 2 4 6 7 8 9 10 11 17 26

public class tcp_server implements Runnable {
    // EXEPTONS : VYJIMKY : 
    protected static class FormatException extends Exception {}
    protected static class LogicException extends Exception {}
    protected static class TimeoutException extends Exception {}
    protected static class AuthenticationException extends Exception {}

    // RECHARGINS:
    protected final String CLIENT_RECHARGING = "RECHARGING";
    protected final String CLIENT_FULL_POWER = "FULL POWER";

    // MAX DELKY : 
    protected final int MAX_USERNAME = 100;
    protected final int MAX_PASSWORD = 7;
    protected final int MAX_CONFIRM = 12;
    protected final int MAX_RECHARGING = 12;
    protected final int MAX_FULL_POWER = 12;
    protected final int MAX_MESSAGE = 100;

    // STRINGY NA VYPIS : 
    protected final String SERVER_LOGIN_FAILED = "300 LOGIN FAILED\r\n";
    protected final String SERVER_SYNTAX_ERROR = "301 SYNTAX ERROR\r\n";
    protected final String SERVER_LOGIC_ERROR = "302 LOGIC ERROR\r\n";
    protected final String SERVER_USER = "100 LOGIN\r\n";
    protected final String SERVER_PASSWORD = "101 PASSWORD\r\n";
    protected final String SERVER_MOVE = "102 MOVE\r\n";
    protected final String SERVER_TURN_LEFT = "103 TURN LEFT\r\n";
    protected final String SERVER_TURN_RIGHT = "104 TURN RIGHT\r\n";
    protected final String SERVER_GET_MESSAGE = "105 GET MESSAGE\r\n";
    protected final String SERVER_OK = "200 OK\r\n";
    
  

    // TIMEOUTY :  1 a 5 secund
    protected final int TIMEOUT = 1000;
    protected final int TIMEOUT_RECHARGING = 5000;

    // Na porovnani posouvani, pochyb (moving, rotating)
    protected final String PATTERN = "^OK -{0,1}[0-9]* -{0,1}[0-9]*$"; 

    


    // DULEZITE PROMENNE:
    protected Socket csocket = null; // client csocket
    protected PrintWriter out; // buffer out // input socketu
    protected BufferedReader in; // buffer in // output socketu



//----------------------------------------------------------------------------------------------------------------------------------------

    tcp_server(Socket csocket) throws IOException {  // parametrem je client socket

       this.csocket = csocket;
       out = new PrintWriter(csocket.getOutputStream(), true);                       // otevirame input
       in = new BufferedReader( new InputStreamReader(csocket.getInputStream()));    // otervirame output buffer
       csocket.setSoTimeout(TIMEOUT); // pokud nebude zadna opdoved v tomto casovem intervalu -> tak ukonci spojeni (1 sekunda)

    }


//----------------------------------------------------------------------------------------------------------------------------------------

  public static void main(String args[]) throws Exception { // main
  
      ServerSocket ssock = new ServerSocket(1234); // vytvarime socket serveru a pridelujeme port 1234
      System.out.println("Listening");
      
      while (true) {

         Socket sock = ssock.accept();     // server ceka na pripojeni a vypisujeme "Connected" az se nekdo pripoji 
         System.out.println("Connected");    
         new Thread(new tcp_server(sock)).start(); // method start -> spustit novy thread, dedeni // navic pridat sychronized
         
      }

  }

//----------------------------------------------------------------------------------------------------------------------------------------
     public void run() {
        try {
           
                 // out = new PrintWriter(csocket.getOutputStream(), true);
                 // in = new BufferedReader( new InputStreamReader(csocket.getInputStream()));

             
                 byte [] byte_incoming = null;

                 

                 try{

//---------------------- -------------------------------LOGIN A PASSWORD  (ZPRACOVANI )---------------------------------------------------------------------

                      SendMes(SERVER_USER);
                      // byte [] - neje
                      byte [] login_incoming = WorkingWithRecievedMess(MAX_USERNAME); // zpracovani loginu,  (byte data type can be useful for saving memory in large arrays)
                      // (byte) 0x65, (byte)0x10

                      //byte_incoming = login.getBytes(Charset.forName("US-ASCII")); // переведем на байты

                      int sumofexpectedpasswd = ExpextedPassword(login_incoming); // Spocitame sumu ASCII -> ocekovany password

                      SendMes(SERVER_PASSWORD);  

                      byte [] passwd = WorkingWithRecievedMess(MAX_PASSWORD);
                    

                      LookingForZeroAndConverting(passwd); // NULL-TERMINATED '\0'

                      int pass = Integer.parseInt(new String(passwd)); // PREVEDEME Bajtove heslo na INT
                    

                      if(pass == sumofexpectedpasswd)              // KONTROLA PASSWORDU , musi se rovant sume ASCII drive spocitane z loginu
                      {
                          SendMes(SERVER_OK);
                      } else {
                          throw new AuthenticationException();
                      }

//--------------------------------------------------------------------------------------------------------------------------------------------------------
                      
                      // PRVNI POCHYB PRO ZJISTENI SOURADNIC
                      SendMes(SERVER_MOVE); 

                      byte [] message = WorkingWithRecievedMess(MAX_CONFIRM); //  Potvrzení o provedení pohybu, kde x a y jsou souřadnice robota po provedení pohybového p
                      
                     // System.out.println("HERE Pada -> " + new String(message));
                      
                      Moving(message); // ZPRACOVANI SOURADNIC v METHODE MOVING

                      //if(0.0) -> getMessage
                      //esle{moving}



                      SendMes(SERVER_GET_MESSAGE);
                      message = WorkingWithRecievedMess(MAX_MESSAGE);
                      LookingForZeroAndConverting(message);
                     
                      SendMes(SERVER_OK);


                      //closeConnection();
                   
                   } catch (FormatException | NumberFormatException ex) {
                    SendMes(SERVER_SYNTAX_ERROR);
                    closeConnection();
                  } catch (TimeoutException | SocketTimeoutException ex) {
                    closeConnection();
                 } catch (LogicException ex) {     // RECHARGE CHYBY, SPATNY STIRNG, nebo '\0'
                    SendMes(SERVER_LOGIC_ERROR);
                    closeConnection();
              } catch (AuthenticationException ex) {  // ( HESLO != SUMA  OF ASCII) drive spositane z loginu
                    SendMes(SERVER_LOGIN_FAILED);
                    closeConnection(); 
          }finally {    // The finally block always executes when the try block exits. 
                closeConnection();
        }

      } catch (IOException e) { // Reading a network file and got disconnected. Using some stream to read data and some other process closed the stream.
         System.out.println(e);
 
      }

   }
//------------------------------------------------------ METHODS : -------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------   
   private void closeConnection() throws IOException { // UZAVRIME SPOJENI: INPUT, OUTPUT a CLIENT SOCKET
        in.close();
        out.close();
        csocket.close();
    }

//--------------------------------------------------------------------------------------------------------------------------------------  
private int ExpextedPassword(byte [] login_incoming) { // SPOCITAME SUMU OCEKOVANEHO HESLA

       // There is no "+"" operator for byte. byte is promoted to int before being processed by "+""

        int sumofpasswd = 0;            
        for (byte b : login_incoming) {
            sumofpasswd += b;                 // result is implicitly of type int.
        }
        return sumofpasswd;
}


//------------------------------------------------------------------------------------------------------------------------------------  
private void SendMes(String message) throws IOException { // POUZIVAME METHODU PRO ODESILANI ZPRAVY CLIENTOVI
        out.print(message);
        out.flush();
}
//------------------------------------------------------------------------------------------------------------------------------------ 

private byte []  WorkingWithRecievedMess(int maxLength) throws  IOException, FormatException , LogicException, TimeoutException
                   
{
    // The ByteArrayOutputStream class stream creates a buffer in memory and all the data sent to the stream is stored in the buffer.
    //  This class implements an output stream in which the data is written into a byte array;
    // The data can be retrieved using toByteArray() and toString(). 

    ByteArrayOutputStream uloziste = new ByteArrayOutputStream();

    byte [] docasna = null;

    byte onebajt;
    int cntbjatu = 0;
    int catchR = 0; // JESLI PRECHOZI SYMBOL BYL  '\r' -> nastav na 1

      while((onebajt = (byte) in.read()) != -1) // while ne EOF
          {
            if(onebajt != '\r' && onebajt != '\n')
            {
              if(catchR == 1) 
                {
                  uloziste.write('\r');
                  catchR = 0;
                }

              uloziste.write(onebajt);
            }

            if(onebajt == '\r') { // ocekavame na END;
                if(catchR == 1) uloziste.write('\r');
                catchR = 1; 
            }


            if(onebajt == '\n')            
            {
              if(catchR == 1) break;
              else uloziste.write(onebajt);
            }        
            
            cntbjatu++; // inkrementuj
            if(cntbjatu >=  maxLength &&   !CLIENT_RECHARGING.startsWith(new String(uloziste.toByteArray())))  
            {
                //System.out.println("cnt = "  + cntbjatu);
                throw new FormatException();
            }
          }
        
          docasna = uloziste.toByteArray();   // prevodime na pole bajtu

         // Pred tim, jak vratit - > check -> DOBIJENI-------------------------------------------------------------------------------

         if((new String(docasna)).equals(CLIENT_RECHARGING) ) // nead REACHARGING
          {
              csocket.setSoTimeout(TIMEOUT_RECHARGING); //  waiting 5 secund

              byte [] fullpower = WorkingWithRecievedMess(MAX_FULL_POWER); // max delka 12

               if(!(new String(fullpower)).equals(CLIENT_FULL_POWER)) // kontrola spravnosti stringu
                   {
                     throw new LogicException();
                  }

              csocket.setSoTimeout(TIMEOUT); // POKUD NEBUDE ZADNA OPDOVED V PRUBEHO TOHOTO CASOVEHO INTEVALU -> UKONCI SPOJENI -> TIME EXCEPTION.

              for(byte b : fullpower)   // check fullpower PRO JISTOTU, muzu smazat, je navic?
                  if(b == '\0') 
                  {
                    throw new LogicException();
                  }

              docasna = WorkingWithRecievedMess(maxLength); // new messege recieved
          }
          // ----------------------------------------------------------------------------------------------------------------------

    return docasna;
}
//------------------------------------------------------------------------------------------------------------------------------------
private void LookingForZeroAndConverting(byte [] bytes) throws IOException, FormatException 
{
    for (byte b : bytes)
            if (b == '\0')      // HLEDAME '\0' NULL TERMINATED -> POKUD NAJDEME -> HODIME EXCEPTION
                throw new FormatException();
}


//------------------------------------------------------------------------------------------------------------------------------------
private boolean Moving (byte [] bytes) throws IOException, FormatException, LogicException, TimeoutException, SocketTimeoutException
{
  // PREVIOUS : 
  int previous_x;
  int previous_y;
 // CURRENTS :
  int current_x;
  int current_y;

  byte [] answer = null; 


  LookingForZeroAndConverting(bytes); // jestli je tam \0
  //System.out.println("JSEM");
  
  if(!(new String(bytes).matches(PATTERN))) throw new FormatException(); // PRESNY FORMAT SOURADNIC -> "OK -5 10\r\n" -> KONTROLA

 // System.out.println("After pattern");
  
  Scanner scan = new Scanner (new String(bytes).substring(3)); // A Scanner breaks its input into tokens using a delimiter pattern, which by default matches whitespace
  
  current_x = scan.nextInt();
  current_y = scan.nextInt();

  previous_y = current_y;
  previous_x = current_x;

  while(true)
  {
//    System.out.println("x -> " + current_x + " y -> " + current_y);

    if (current_x == 0 && current_y == 0 ) break; // AZ BUDE NA ZACATKU SOURADNIC -> BREAK -> A VRAT TRUE
    else 
    {   
        // Direction : 
            if(current_x == previous_x && current_y == previous_y )
            {
                  SendMes(SERVER_MOVE);

                  answer = WorkingWithRecievedMess(MAX_CONFIRM);
                  
            }
            else 
            { 
              
                String direction  =  DirectionOfMoving(current_x - previous_x, current_y - previous_y);

                System.out.println("direction -> " + direction);

                SendMes(StepORTurning(direction, current_x, current_y));

                answer = WorkingWithRecievedMess(MAX_CONFIRM);
                


            }
               
          LookingForZeroAndConverting(answer);

          if (!(new String(answer).matches(PATTERN))) throw new FormatException();

          scan = new Scanner (new String(answer).substring(3));
          previous_x = current_x;
          previous_y = current_y;

          current_x = scan.nextInt();
          current_y = scan.nextInt();
  }

  }


  return true;
}

//------------------------------------------------------------------------------------------------------------------------------------

private String DirectionOfMoving (int x_diff, int y_diff ) {
        if (y_diff == 0 && x_diff > 0)
            return "RIGHT";
        else if (y_diff == 0 && x_diff < 0)
            return "LEFT";
        else if (y_diff > 0 && x_diff == 0)
            return "UP";
        else 
            return "DOWN";
}

private String StepORTurning (String direction, int x, int y) throws IOException, FormatException, LogicException, TimeoutException
{
  System.out.println("HERE JSEM !!!!");
  if(x == 0)
  {
      if(y > 0)
      {
          switch(direction)
          {
              case "UP": SendMes(SERVER_TURN_LEFT); byte [] answer = WorkingWithRecievedMess(MAX_CONFIRM); LookingForZeroAndConverting(answer); return SERVER_TURN_LEFT;
              case "LEFT" : return SERVER_TURN_LEFT; 
              case "DOWN"  :  return SERVER_MOVE;
              case "RIGHT" : return SERVER_TURN_RIGHT;
          }
      } 
      else if(y < 0)
      {
        switch(direction)
        {
              case "UP" : return SERVER_MOVE;
              case "RIGHT" : return SERVER_TURN_LEFT;
              case "DOWN" : SendMes(SERVER_TURN_LEFT); byte [] answer = WorkingWithRecievedMess(MAX_CONFIRM); LookingForZeroAndConverting(answer); return SERVER_TURN_LEFT;
              case "LEFT" : return SERVER_TURN_RIGHT; 
        }
      }
  }
  else if(y == 0)
  {
      if(x > 0)
      {   
        switch(direction){
            case "UP" : return SERVER_TURN_LEFT; 
            case "LEFT" : return SERVER_MOVE;
            case "RIGHT" : SendMes(SERVER_TURN_LEFT); byte [] answer = WorkingWithRecievedMess(MAX_CONFIRM); LookingForZeroAndConverting(answer); return SERVER_TURN_LEFT;
            case "DOWN" : return SERVER_TURN_RIGHT; 
          }
      }
      else if(x < 0)
      {
        switch(direction){
           case "UP" : return SERVER_TURN_RIGHT;
           case "RIGHT" : return SERVER_MOVE;
           case "LEFT" : SendMes(SERVER_TURN_RIGHT); byte [] answer = WorkingWithRecievedMess(MAX_CONFIRM); LookingForZeroAndConverting(answer); return SERVER_TURN_RIGHT; 
           case "DOWN" : return SERVER_TURN_LEFT; 
         }
      }
      
  }
  else if(x > 0 && y > 0) // JDU K X
  {
      switch(direction)
      {
        case "UP" : return SERVER_TURN_LEFT;
        case "LEFT": return SERVER_TURN_LEFT;
        case "DOWN" : return SERVER_MOVE;
        case "RIGHT" : return SERVER_TURN_RIGHT;
      }
  }
  else if(x < 0 && y > 0) // JDU K X
  {
      switch(direction)
      {
        case "UP" : return SERVER_TURN_RIGHT;
        case "RIGHT": return SERVER_TURN_RIGHT;
        case "DOWN" : return SERVER_MOVE;
        case "LEFT": return SERVER_TURN_LEFT;
      }
  }
  else if(x < 0 && y < 0) // JDU K X
  {
      switch(direction)
      {
        case "DOWN" : return SERVER_TURN_RIGHT;
        case "LEFT" : return SERVER_TURN_RIGHT;
        case "UP" : return SERVER_MOVE;
        case "RIGHT" : return SERVER_TURN_LEFT;
      }
  }
  else if(x > 0 && y < 0)
  {
    switch(direction)
    {
      case "UP" : return SERVER_MOVE;
      case "LEFT" : return SERVER_TURN_RIGHT;
      case "DOWN" : return SERVER_TURN_RIGHT;
      case "RIGHT" : return SERVER_TURN_LEFT;  
    }
  }
  
  return SERVER_MOVE;
}




//------------------------------------------------------------------------------------------------------------------------------------
    
}
