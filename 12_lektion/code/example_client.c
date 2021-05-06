#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <errno.h>

#define SERVER_PORT        9999
#define SERVER_ADDR     "127.0.0.1"     // localhost
#define MAXBUF          1024

int main() {
    int sock_fd;
    struct sockaddr_in dest;
    char buffer[MAXBUF];

    if ( (sock_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0 ) {
		printf("could not create socket");
		exit(errno);
	}

	memset(&dest, 0, sizeof(dest));
	dest.sin_family = AF_INET;
	dest.sin_port = htons(SERVER_PORT);
    if ( inet_aton(SERVER_ADDR, (struct in_addr*) &dest.sin_addr.s_addr) == 0 ) {
        printf("problems using %s as an address", SERVER_ADDR);
        exit(errno);
    }

    if ( connect(sock_fd, (struct sockaddr*)&dest, sizeof(dest)) != 0 ) {
        printf("Connecting to the server");
        exit(errno);
    }

    bzero(buffer, MAXBUF);
    recv(sock_fd, buffer, sizeof(buffer), 0);
    printf("Received:\n%s", buffer);

    close(sock_fd);
    return 0;
}
