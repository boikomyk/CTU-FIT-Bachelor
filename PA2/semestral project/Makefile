CXX=g++
LD=g++
CFLAGS=-Wall -pedantic -Wno-long-long -O0 -ggdb -std=c++14
 
OBJECTS=CDirectory.o CNote.o CNoteShopList.o CNoteTaskList.o CNoteText.o CSQLManager.o CSearchRequest.o DB.o EditWindow.o EditWindowShopList.o EditWindowTaskList.o EditWindowTextNote.o GUI.o Window.o main.o


all: compile doc

CDirectory.o: src/CDirectory.cpp src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CNote.o: src/CNote.cpp src/CNote.h src/DB.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CNoteShopList.o: src/CNoteShopList.cpp src/CNoteShopList.h src/CNote.h src/DB.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CNoteTaskList.o: src/CNoteTaskList.cpp src/CNoteTaskList.h src/CNote.h src/DB.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CNoteText.o: src/CNoteText.cpp src/CNoteText.h src/CNote.h src/DB.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CSQLManager.o: src/CSQLManager.cpp src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
CSearchRequest.o: src/CSearchRequest.cpp src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
DB.o: src/DB.cpp src/DB.h
	$(CXX) $(CFLAGS) -c -o $@ $<
EditWindow.o: src/EditWindow.cpp src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
EditWindowShopList.o: src/EditWindowShopList.cpp src/EditWindowShopList.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
EditWindowTaskList.o: src/EditWindowTaskList.cpp src/EditWindowTaskList.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
EditWindowTextNote.o: src/EditWindowTextNote.cpp src/EditWindowTextNote.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
GUI.o: src/GUI.cpp src/GUI.h src/Window.h src/EditWindowTextNote.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h src/EditWindowTaskList.h src/EditWindowShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
Window.o: src/Window.cpp src/Window.h src/EditWindowTextNote.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h src/EditWindowTaskList.h src/EditWindowShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<
main.o: src/main.cpp src/GUI.h src/Window.h src/EditWindowTextNote.h src/EditWindow.h src/CDirectory.h src/CSearchRequest.h src/CSQLManager.h src/CNoteText.h src/CNote.h src/DB.h src/CNoteTaskList.h src/CNoteShopList.h src/EditWindowTaskList.h src/EditWindowShopList.h
	$(CXX) $(CFLAGS) -c -o $@ $<

compile: $(OBJECTS)
	$(LD) $(CFLAGS) -o boikomyk $(OBJECTS) -lsqlite3 -lmenu -lncurses -lpanel -lform 

doc:
	doxygen Doxyfile
run:
	./boikomyk
	
	
clean:
	rm -rf $(OBJECTS) boikomyk doc