# diagram.py
from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway



graph_attr={
    "bgcolor": "transparent"
}
with Diagram("CSV to Heartbeat YAML", show=False, outformat="png", filename="overview", graph_attr=graph_attr):

    lambda_converter = Lambda("Converter")
    lambda_retention = Lambda("Lambda Retention policy")
    gw = APIGateway("API Gateway")
    gw >> lambda_converter
    
    