pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                echo 'Stopping existing containers...'
                sh 'docker compose -f $COMPOSE_FILE down || true'

                echo 'Building and starting containers...'
                sh 'docker compose -f $COMPOSE_FILE up -d --build'
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying containers are running...'
                sleep(time: 5, unit: 'SECONDS')
                sh 'docker compose -f $COMPOSE_FILE ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! App is running.'
        }
        failure {
            echo 'Pipeline failed. Rolling back...'
            sh 'docker compose -f $COMPOSE_FILE down || true'
        }
    }
}