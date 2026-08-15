  async updateSettings(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) return this.prisma.company.create({ data });

    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: data.name,
        trn: data.trn,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logoUrl: data.logoUrl,
        invoiceHeader: data.invoiceHeader,
        invoiceFooter: data.invoiceFooter,
        authorizedSignatureUrl: data.authorizedSignatureUrl, // NEW
        companySealUrl: data.companySealUrl,                 // NEW
        vatPercent: parseFloat(data.vatPercent) || 5,
        invoicePrefix: data.invoicePrefix,
        poPrefix: data.poPrefix,
        woPrefix: data.woPrefix,
      },
    });
  }
