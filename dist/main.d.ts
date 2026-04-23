import { Construct } from 'constructs';
import { Chart, ChartProps } from 'cdk8s';
/**
 * SampleAppChart defines the sample-app Deployment and Service
 */
export declare class SampleAppChart extends Chart {
    constructor(scope: Construct, id: string, props?: ChartProps);
}
/**
 * ApplicationSet Chart for ArgoCD
 */
export declare class ApplicationSetChart extends Chart {
    constructor(scope: Construct, id: string, props?: ChartProps);
}
