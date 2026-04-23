"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationSetChart = exports.SampleAppChart = void 0;
const cdk8s_1 = require("cdk8s");
const kplus = __importStar(require("cdk8s-plus-26"));
/**
 * SampleAppChart defines the sample-app Deployment and Service
 */
class SampleAppChart extends cdk8s_1.Chart {
    constructor(scope, id, props = {}) {
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
                            request: cdk8s_1.Size.mebibytes(64),
                            limit: cdk8s_1.Size.mebibytes(128),
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
exports.SampleAppChart = SampleAppChart;
/**
 * ApplicationSet Chart for ArgoCD
 */
class ApplicationSetChart extends cdk8s_1.Chart {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        new cdk8s_1.ApiObject(this, 'SampleAppApplicationSet', {
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
exports.ApplicationSetChart = ApplicationSetChart;
const app = new cdk8s_1.App();
new SampleAppChart(app, 'sample-app', {
    namespace: 'apps/sample-app',
});
new ApplicationSetChart(app, 'applicationset', {
    namespace: 'apps/sample-app',
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlDQUFnRTtBQUNoRSxxREFBdUM7QUFFdkM7O0dBRUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxhQUFLO0lBQ3ZDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBb0IsRUFBRTtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ2hFLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsWUFBWTthQUNuQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDbkUsUUFBUSxFQUFFLENBQUM7WUFDWCxVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLEtBQUssRUFBRSxZQUFZO29CQUNuQixVQUFVLEVBQUUsRUFBRTtvQkFDZCxTQUFTLEVBQUU7d0JBQ1QsR0FBRyxFQUFFOzRCQUNILE9BQU8sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7NEJBQzlCLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7eUJBQzdCO3dCQUNELE1BQU0sRUFBRTs0QkFDTixPQUFPLEVBQUUsWUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7NEJBQzNCLEtBQUssRUFBRSxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQzt5QkFDM0I7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUk7Z0JBQ3pCLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsWUFBWTtpQkFDbEI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMxQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVO1lBQ3pDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDckMsSUFBSSxFQUFFLFlBQVk7U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0NELHdDQTJDQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxhQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBb0IsRUFBRTtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLGlCQUFTLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFO1lBQzdDLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFNBQVMsRUFBRSxRQUFRO2FBQ3BCO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLFVBQVUsRUFBRTtvQkFDVjt3QkFDRSxJQUFJLEVBQUU7NEJBQ0osUUFBUSxFQUFFO2dDQUNSO29DQUNFLE9BQU8sRUFBRSxLQUFLO29DQUNkLEdBQUcsRUFBRSxnQ0FBZ0M7aUNBQ3RDOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLHdCQUF3QjtxQkFDL0I7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxTQUFTO3dCQUNsQixNQUFNLEVBQUU7NEJBQ04sT0FBTyxFQUFFLDZDQUE2Qzs0QkFDdEQsY0FBYyxFQUFFLE1BQU07NEJBQ3RCLElBQUksRUFBRSxzQkFBc0I7eUJBQzdCO3dCQUNELFdBQVcsRUFBRTs0QkFDWCxNQUFNLEVBQUUsU0FBUzs0QkFDakIsU0FBUyxFQUFFLFlBQVk7eUJBQ3hCO3dCQUNELFVBQVUsRUFBRTs0QkFDVixTQUFTLEVBQUU7Z0NBQ1QsS0FBSyxFQUFFLElBQUk7Z0NBQ1gsUUFBUSxFQUFFLElBQUk7NkJBQ2Y7NEJBQ0QsV0FBVyxFQUFFLENBQUMsc0JBQXNCLENBQUM7eUJBQ3RDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFuREQsa0RBbURDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFO0lBQ3BDLFNBQVMsRUFBRSxpQkFBaUI7Q0FDN0IsQ0FBQyxDQUFDO0FBRUgsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7SUFDN0MsU0FBUyxFQUFFLGlCQUFpQjtDQUM3QixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcCwgQ2hhcnQsIENoYXJ0UHJvcHMsIEFwaU9iamVjdCwgU2l6ZSB9IGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjYnO1xuXG4vKipcbiAqIFNhbXBsZUFwcENoYXJ0IGRlZmluZXMgdGhlIHNhbXBsZS1hcHAgRGVwbG95bWVudCBhbmQgU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgU2FtcGxlQXBwQ2hhcnQgZXh0ZW5kcyBDaGFydCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDaGFydFByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBrcGx1cy5OYW1lc3BhY2UodGhpcywgJ1NhbXBsZUFwcE5hbWVzcGFjZScsIHtcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdzYW1wbGUtYXBwJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGtwbHVzLkRlcGxveW1lbnQodGhpcywgJ1NhbXBsZUFwcERlcGxveW1lbnQnLCB7XG4gICAgICByZXBsaWNhczogMyxcbiAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdzYW1wbGUtYXBwJyxcbiAgICAgICAgICBpbWFnZTogJ25naW54OjEuMjEnLFxuICAgICAgICAgIHBvcnROdW1iZXI6IDgwLFxuICAgICAgICAgIHJlc291cmNlczoge1xuICAgICAgICAgICAgY3B1OiB7XG4gICAgICAgICAgICAgIHJlcXVlc3Q6IGtwbHVzLkNwdS5taWxsaXMoMjUwKSxcbiAgICAgICAgICAgICAgbGltaXQ6IGtwbHVzLkNwdS5taWxsaXMoNTAwKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZW1vcnk6IHtcbiAgICAgICAgICAgICAgcmVxdWVzdDogU2l6ZS5tZWJpYnl0ZXMoNjQpLFxuICAgICAgICAgICAgICBsaW1pdDogU2l6ZS5tZWJpYnl0ZXMoMTI4KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZS5uYW1lLFxuICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICBhcHA6ICdzYW1wbGUtYXBwJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBkZXBsb3ltZW50LmV4cG9zZVZpYVNlcnZpY2Uoe1xuICAgICAgc2VydmljZVR5cGU6IGtwbHVzLlNlcnZpY2VUeXBlLkNMVVNURVJfSVAsXG4gICAgICBwb3J0czogW3sgcG9ydDogODAsIHRhcmdldFBvcnQ6IDgwIH1dLFxuICAgICAgbmFtZTogJ3NhbXBsZS1hcHAnLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQXBwbGljYXRpb25TZXQgQ2hhcnQgZm9yIEFyZ29DRFxuICovXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25TZXRDaGFydCBleHRlbmRzIENoYXJ0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENoYXJ0UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IEFwaU9iamVjdCh0aGlzLCAnU2FtcGxlQXBwQXBwbGljYXRpb25TZXQnLCB7XG4gICAgICBhcGlWZXJzaW9uOiAnYXJnb3Byb2ouaW8vdjFhbHBoYTEnLFxuICAgICAga2luZDogJ0FwcGxpY2F0aW9uU2V0JyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdzYW1wbGUtYXBwJyxcbiAgICAgICAgbmFtZXNwYWNlOiAnYXJnb2NkJyxcbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIGdlbmVyYXRvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsaXN0OiB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgY2x1c3RlcjogJ2RldicsXG4gICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2t1YmVybmV0ZXMuZGVmYXVsdC5zdmMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6ICd7e2NsdXN0ZXJ9fS1zYW1wbGUtYXBwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIHByb2plY3Q6ICdkZWZhdWx0JyxcbiAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICByZXBvVVJMOiAnaHR0cHM6Ly9naXRodWIuY29tL0hvYW5ndnU3NS9rOHNfbWFuaWZlc3RfMicsXG4gICAgICAgICAgICAgIHRhcmdldFJldmlzaW9uOiAnSEVBRCcsXG4gICAgICAgICAgICAgIHBhdGg6ICdkaXN0L2FwcHMvc2FtcGxlLWFwcCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICAgICAgc2VydmVyOiAne3t1cmx9fScsXG4gICAgICAgICAgICAgIG5hbWVzcGFjZTogJ3NhbXBsZS1hcHAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN5bmNQb2xpY3k6IHtcbiAgICAgICAgICAgICAgYXV0b21hdGVkOiB7XG4gICAgICAgICAgICAgICAgcHJ1bmU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2VsZkhlYWw6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN5bmNPcHRpb25zOiBbJ0NyZWF0ZU5hbWVzcGFjZT10cnVlJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IFNhbXBsZUFwcENoYXJ0KGFwcCwgJ3NhbXBsZS1hcHAnLCB7XG4gIG5hbWVzcGFjZTogJ2FwcHMvc2FtcGxlLWFwcCcsXG59KTtcblxubmV3IEFwcGxpY2F0aW9uU2V0Q2hhcnQoYXBwLCAnYXBwbGljYXRpb25zZXQnLCB7XG4gIG5hbWVzcGFjZTogJ2FwcHMvc2FtcGxlLWFwcCcsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=