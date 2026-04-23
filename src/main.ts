import { Construct } from 'constructs';
import { App, Chart, ChartProps, ApiObject, Size } from 'cdk8s';
import * as kplus from 'cdk8s-plus-26';

/**
 * SampleAppChart defines the sample-app Deployment and Service
 */
export class SampleAppChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const namespace = new kplus.Namespace(this, 'SampleAppNamespace', {
      metadata: {
        name: 'sample-app',
      },
    });

    const deployment = new kplus.Deployment(this, 'SampleAppDeployment', {
      replicas: 3,
      containers: [
        {
          name: 'sample-app',
          image: 'nginx:1.21',
          portNumber: 80,
          resources: {
            cpu: {
              request: kplus.Cpu.millis(250),
              limit: kplus.Cpu.millis(500),
            },
            memory: {
              request: Size.mebibytes(64),
              limit: Size.mebibytes(128),
            },
          },
        },
      ],
      metadata: {
        namespace: namespace.name,
        labels: {
          app: 'sample-app',
        },
      },
    });

    deployment.exposeViaService({
      serviceType: kplus.ServiceType.CLUSTER_IP,
      ports: [{ port: 80, targetPort: 80 }],
      name: 'sample-app',
    });
  }
}

/**
 * ApplicationSet Chart for ArgoCD
 */
export class ApplicationSetChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    new ApiObject(this, 'SampleAppApplicationSet', {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'ApplicationSet',
      metadata: {
        name: 'sample-app',
        namespace: 'argocd',
      },
      spec: {
        generators: [
          {
            list: {
              elements: [
                {
                  cluster: 'dev',
                  url: 'https://kubernetes.default.svc',
                },
              ],
            },
          },
        ],
        template: {
          metadata: {
            name: '{{cluster}}-sample-app',
          },
          spec: {
            project: 'default',
            source: {
              repoURL: 'https://github.com/Hoangvu75/k8s_manifest_2',
              targetRevision: 'HEAD',
              path: 'dist/apps/sample-app',
            },
            destination: {
              server: '{{url}}',
              namespace: 'sample-app',
            },
            syncPolicy: {
              automated: {
                prune: true,
                selfHeal: true,
              },
              syncOptions: ['CreateNamespace=true'],
            },
          },
        },
      },
    });
  }
}

const app = new App();

new SampleAppChart(app, 'sample-app', {
  namespace: 'apps/sample-app',
});

new ApplicationSetChart(app, 'applicationset', {
  namespace: 'apps/sample-app',
});

app.synth();
