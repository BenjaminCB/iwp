#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <errno.h>

#define MY_PORT		9999
#define MAXBUF		1024

int main(int argc, char *argv[]) {
	int server_sock_fd;
	struct sockaddr_in my_address;
	char buffer[MAXBUF];

    if ( (server_sock_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0 ) {
		printf("could not create socket");
		exit(errno);
	}

	memset(&my_address, 0, sizeof(my_address));
	my_address.sin_family = AF_INET;
	my_address.sin_port = htons(MY_PORT);
	my_address.sin_addr.s_addr = INADDR_ANY;
    if ( bind(server_sock_fd, (struct sockaddr*)&my_address, sizeof(my_address)) != 0 ) {
		printf("could not bind socket");
		exit(errno);
	}

	if ( listen(server_sock_fd, 5) != 0 ) {
		printf("could not listen() on the socket");
		exit(errno);
	}

	while (1) {
		int client_fd;
		struct sockaddr_in client_addr;
		int addrlen=sizeof(client_addr);

		client_fd = accept(server_sock_fd, (struct sockaddr*)&client_addr, &addrlen);
		printf("%s:%d connected\n", inet_ntoa(client_addr.sin_addr), ntohs(client_addr.sin_port));

		sprintf(buffer, "you are %s:%d\n", inet_ntoa(client_addr.sin_addr), ntohs(client_addr.sin_port));
		send(client_fd, buffer, strlen(buffer)+1, 0);

		close(client_fd);
	}

	close(server_sock_fd);
	return 0;
}
