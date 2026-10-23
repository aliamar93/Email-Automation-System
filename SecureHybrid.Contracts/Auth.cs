using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Contracts.Auth;

public sealed record LoginRequest(string Email, string Password);
public sealed record LoginResponse(string AccessToken);
